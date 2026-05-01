import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note, NoteDocument } from '../entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import type { DeleteNoteResult, NoteDetail, NoteListItem, NoteStats, ActivityItem, NotesResponse, PerformanceMetrics, PaginationInfo } from './notes.types';
import { SortField, SortOrder, SortedNote, createMergeSort, createQuickSort, createBubbleSort } from '../utils';
import { calculatePerformance } from '../utils/performance-metrics';

export type SortOption = 'newest' | 'oldest' | 'alpha' | 'views' | 'comments';
export type SortAlgorithm = 'merge' | 'quick' | 'bubble' | 'mongo';

@Injectable()
export class NotesService {
  private mergeSort = createMergeSort();
  private quickSort = createQuickSort();
  private bubbleSort = createBubbleSort();

  constructor(
    @InjectModel(Note.name)
    private readonly notesModel: Model<NoteDocument>,
  ) {}

  private getCompareFunction(field: SortField, order: SortOrder): (a: SortedNote, b: SortedNote) => number {
    return (a: SortedNote, b: SortedNote) => {
      let comparison = 0;
      
      switch (field) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'views':
          comparison = a.views - b.views;
          break;
        case 'commentCount':
          comparison = a.commentCount - b.commentCount;
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'createdAt':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      
      return order === 'desc' ? -comparison : comparison;
    };
  }

  private getSortAlgorithm(algo: SortAlgorithm) {
    switch (algo) {
      case 'merge':
        return this.mergeSort;
      case 'quick':
        return this.quickSort;
      case 'bubble':
        return this.bubbleSort;
      case 'mongo':
      default:
        return null;
    }
  }

  async create(createNoteDto: CreateNoteDto): Promise<NoteDetail> {
    const note = await this.notesModel.create({
      title: createNoteDto.title,
      content: createNoteDto.content,
      tags: createNoteDto.tags ?? [],
      comments: [],
      views: 0,
    });

    return this.toNoteDetail(note);
  }

  async findAll(
    tag?: string,
    search?: string,
    sort: SortOption = 'newest',
    algorithm: SortAlgorithm = 'merge',
    page: number = 1,
    limit: number = 10,
  ): Promise<NotesResponse> {
    const filter: any = {};

    if (tag) {
      filter.tags = { $regex: new RegExp(tag, 'i') };
    }

    if (search && search.length >= 2) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } }
      ];
    }

    const startTime = process.hrtime.bigint();
    const total = await this.notesModel.countDocuments(filter);
    
    // Fetch notes with pagination
    let notes = await this.notesModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    // If using MongoDB native sort
    if (algorithm === 'mongo') {
      const sortMap: Record<SortOption, any> = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        alpha: { title: 1 },
        views: { views: -1 },
        comments: { 'comments.length': -1 },
      };
      notes = await this.notesModel
        .find(filter)
        .sort(sortMap[sort] || { createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      
      const performance = calculatePerformance('mongo', 'MongoDB Native', startTime, total);
      
      return this.buildResponse(notes, page, limit, total, performance);
    }

    // Fetch all for custom sorting (no pagination for custom sorts as they need all data)
    const allNotes = await this.notesModel.find(filter).exec();

    // Map to SortedNote for custom sorting
    const sortedNotes: SortedNote[] = allNotes.map(note => {
      const plain = note.toObject();
      return {
        id: plain._id.toString(),
        title: plain.title,
        content: plain.content,
        tags: plain.tags || [],
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
        commentCount: plain.comments?.length || 0,
        views: plain.views || 0,
      };
    });

    // Convert sort option to field and order
    const sortConfig = this.getSortConfig(sort);
    const compareFn = this.getCompareFunction(sortConfig.field, sortConfig.order);

    // Use selected sorting algorithm
    const sorter = this.getSortAlgorithm(algorithm);
    if (!sorter) {
      throw new Error('Invalid sort algorithm');
    }

    const sortedData = sorter.sort(sortedNotes, compareFn);

    // Apply pagination after sorting
    const paginatedData = sortedData.slice((page - 1) * limit, page * limit);

    const algorithmNameMap: Record<SortAlgorithm, string> = {
      merge: 'Merge Sort',
      quick: 'Quick Sort',
      bubble: 'Bubble Sort',
      mongo: 'MongoDB Native',
    };

    const performance = calculatePerformance(
      algorithm,
      algorithmNameMap[algorithm],
      startTime,
      total,
    );

    const noteItems = paginatedData.map(note => ({
      id: note.id,
      title: note.title,
      content: note.content,
      tags: note.tags,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      commentCount: note.commentCount,
      views: note.views,
    }));

    return this.buildResponseFromItems(noteItems, page, limit, total, performance);
  }

  private buildResponse(
    notes: NoteDocument[],
    page: number,
    limit: number,
    total: number,
    performance: PerformanceMetrics,
  ): NotesResponse {
    const totalPages = Math.ceil(total / limit);
    const pagination: PaginationInfo = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    return {
      data: notes.map(note => this.toNoteListItem(note)),
      pagination,
      performance,
    };
  }

  private buildResponseFromItems(
    notes: NoteListItem[],
    page: number,
    limit: number,
    total: number,
    performance: PerformanceMetrics,
  ): NotesResponse {
    const totalPages = Math.ceil(total / limit);
    const pagination: PaginationInfo = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    return {
      data: notes,
      pagination,
      performance,
    };
  }

  private getSortConfig(sort: SortOption): { field: SortField; order: SortOrder } {
    const config: Record<SortOption, { field: SortField; order: SortOrder }> = {
      newest: { field: 'createdAt', order: 'desc' },
      oldest: { field: 'createdAt', order: 'asc' },
      alpha: { field: 'title', order: 'asc' },
      views: { field: 'views', order: 'desc' },
      comments: { field: 'commentCount', order: 'desc' },
    };
    return config[sort] || { field: 'createdAt', order: 'desc' };
  }

  async findOne(id: string): Promise<NoteDetail> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Note not found');
    }

    const note = await this.notesModel
      .findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      )
      .exec();

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return this.toNoteDetail(note);
  }

  async addComment(id: string, createCommentDto: CreateCommentDto): Promise<NoteDetail> {
    await this.findNoteById(id);

    const updated = await this.notesModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            comments: {
              content: createCommentDto.content,
              createdAt: new Date(),
            },
          },
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Note not found');
    }

    return this.toNoteDetail(updated);
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<NoteDetail> {
    await this.findNoteById(id);

    const updated = await this.notesModel
      .findByIdAndUpdate(
        id,
        {
          ...(updateNoteDto.title !== undefined ? { title: updateNoteDto.title } : {}),
          ...(updateNoteDto.content !== undefined ? { content: updateNoteDto.content } : {}),
          ...(updateNoteDto.tags !== undefined ? { tags: updateNoteDto.tags } : {}),
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Note not found');
    }

    return this.toNoteDetail(updated);
  }

  async delete(id: string): Promise<DeleteNoteResult> {
    const note = await this.findNoteById(id);
    await this.notesModel.findByIdAndDelete(note._id.toString()).exec();

    return {
      message: 'Note deleted successfully',
    };
  }

  async getStats(): Promise<NoteStats> {
    const result = await this.notesModel.aggregate([
      {
        $group: {
          _id: null,
          totalNotes: { $sum: 1 },
          totalComments: { $sum: { $size: { $ifNull: ['$comments', []] } } },
          totalViews: { $sum: { $ifNull: ['$views', 0] } }
        }
      }
    ]);

    const tagStats = await this.notesModel.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { tag: '$_id', count: 1, _id: 0 } }
    ]);

    const stats = result[0] || { totalNotes: 0, totalComments: 0, totalViews: 0 };

    return {
      totalNotes: stats.totalNotes,
      totalComments: stats.totalComments,
      totalViews: stats.totalViews,
      tags: tagStats
    };
  }

  async getActivity(limit: number = 10): Promise<ActivityItem[]> {
    const notes = await this.notesModel
      .find({}, 'title createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const activities: ActivityItem[] = notes.map(note => ({
      type: 'note' as const,
      noteId: note._id.toString(),
      title: note.title,
      createdAt: note.createdAt
    }));

    const notesWithComments = await this.notesModel
      .find({ $expr: { $gt: [{ $size: { $ifNull: ['$comments', []] }}, 0] } }, 'title comments')
      .lean();

    const commentActivities: ActivityItem[] = [];
    for (const note of notesWithComments) {
      for (const comment of (note.comments || []).slice(-2)) {
        commentActivities.push({
          type: 'comment',
          noteId: note._id.toString(),
          title: note.title,
          createdAt: comment.createdAt
        });
      }
    }

    const allActivities = [...activities, ...commentActivities]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    return allActivities;
  }

  private async findNoteById(id: string): Promise<NoteDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Note not found');
    }

    const note = await this.notesModel.findById(id).exec();

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  private toNoteListItem(note: NoteDocument): NoteListItem {
    const plain = note.toObject();

    return {
      id: plain._id.toString(),
      title: plain.title,
      content: plain.content,
      tags: plain.tags ?? [],
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
      commentCount: plain.comments?.length ?? 0,
      views: plain.views ?? 0,
    };
  }

  private toNoteDetail(note: NoteDocument): NoteDetail {
    const plain = note.toObject();

    return {
      id: plain._id.toString(),
      title: plain.title,
      content: plain.content,
      tags: plain.tags ?? [],
      comments: plain.comments ?? [],
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
      views: plain.views ?? 0,
    };
  }
}
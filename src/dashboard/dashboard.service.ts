import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { Student } from '../student/entities/student.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { FeeCollection } from '../fee-collection/entities/fee-collection.entity';
import { StudentBalance } from '../student-balance/entities/student-balance.entity';
import { Exam } from '../exam/entities/exam.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementStatus } from './enums/dashboard.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(FeeCollection)
    private readonly feeCollectionRepo: Repository<FeeCollection>,
    @InjectRepository(StudentBalance)
    private readonly balanceRepo: Repository<StudentBalance>,
    @InjectRepository(Exam)
    private readonly examRepo: Repository<Exam>,
  ) {}

  // ── Overview ────────────────────────────────────────────────────────────────

  async getOverview() {
    const [totalStudents, totalTeachers, exams] = await Promise.all([
      this.studentRepo.count(),
      this.teacherRepo.count(),
      this.examRepo.find({ order: { createdAt: 'DESC' }, take: 1 }),
    ]);

    // Derive unique classes and subjects from students and exams
    const students = await this.studentRepo.find();
    const uniqueClasses = new Set(students.map((s) => s.class)).size;

    const allExams = await this.examRepo.find();
    const uniqueSubjects = new Set(allExams.map((e) => e.subject)).size;

    // Current academic year and term from the most recent exam
    const latestExam = exams[0];
    const currentAcademicYear = latestExam?.academicYear ?? 'N/A';
    const currentTerm = latestExam?.term ?? 'N/A';

    return {
      totalStudents,
      totalTeachers,
      totalClasses: uniqueClasses,
      totalSubjects: uniqueSubjects,
      currentAcademicYear,
      currentTerm,
    };
  }

  // ── Statistics ──────────────────────────────────────────────────────────────

  async getStatistics() {
    const [collections, balances, students] = await Promise.all([
      this.feeCollectionRepo.find(),
      this.balanceRepo.find(),
      this.studentRepo.find({ order: { createdAt: 'DESC' } }),
    ]);

    const feesCollected = collections.reduce((sum, c) => sum + Number(c.amountPaid), 0);
    const outstandingFees = balances.reduce((sum, b) => sum + Math.max(0, Number(b.balance)), 0);

    // New admissions: students registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newAdmissions = students.filter((s) => new Date(s.createdAt) >= thirtyDaysAgo).length;

    return {
      feesCollected,
      outstandingFees,
      newAdmissions,
      // Attendance placeholders — wire to attendance module when ready
      studentAttendance: 'Attendance module not yet connected',
      teacherAttendance: 'Attendance module not yet connected',
    };
  }

  // ── Recent Activities ───────────────────────────────────────────────────────

  async getRecentActivities() {
    const [recentStudents, recentTeachers, recentPayments, recentExams] = await Promise.all([
      this.studentRepo.find({ order: { createdAt: 'DESC' }, take: 5 }),
      this.teacherRepo.find({ order: { createdAt: 'DESC' }, take: 5 }),
      this.feeCollectionRepo.find({ order: { createdAt: 'DESC' }, take: 5 }),
      this.examRepo.find({ order: { createdAt: 'DESC' }, take: 5 }),
    ]);

    const activities: { type: string; description: string; timestamp: Date }[] = [];

    recentStudents.forEach((s) =>
      activities.push({
        type: 'Student Registration',
        description: `${s.firstName} ${s.surname} was registered in ${s.class}`,
        timestamp: s.createdAt,
      }),
    );

    recentTeachers.forEach((t) =>
      activities.push({
        type: 'Teacher Added',
        description: `${t.firstName} ${t.lastName} joined as ${t.designation}`,
        timestamp: t.createdAt,
      }),
    );

    recentPayments.forEach((p) =>
      activities.push({
        type: 'Fee Payment',
        description: `Receipt ${p.receiptNumber} — UGX ${Number(p.amountPaid).toLocaleString()} received`,
        timestamp: p.createdAt,
      }),
    );

    recentExams.forEach((e) =>
      activities.push({
        type: 'Exam Created',
        description: `${e.examName} for ${e.class} (${e.subject}) scheduled on ${e.examDate}`,
        timestamp: e.createdAt,
      }),
    );

    // Sort all activities by most recent first
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);
  }

  // ── Announcements CRUD ──────────────────────────────────────────────────────

  async createAnnouncement(dto: CreateAnnouncementDto): Promise<Announcement> {
    return this.announcementRepo.save(this.announcementRepo.create(dto));
  }

  async findAllAnnouncements(): Promise<Announcement[]> {
    return this.announcementRepo.find({ order: { publishDate: 'DESC' } });
  }

  async findOneAnnouncement(id: string): Promise<Announcement> {
    const record = await this.announcementRepo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`Announcement "${id}" not found.`);
    return record;
  }

  async updateAnnouncement(id: string, dto: UpdateAnnouncementDto): Promise<Announcement> {
    const record = await this.findOneAnnouncement(id);
    Object.assign(record, dto);
    return this.announcementRepo.save(record);
  }

  async removeAnnouncement(id: string): Promise<{ message: string }> {
    const record = await this.findOneAnnouncement(id);
    await this.announcementRepo.remove(record);
    return { message: `Announcement "${record.title}" deleted successfully.` };
  }
}
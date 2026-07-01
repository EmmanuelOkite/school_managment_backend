import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, HttpCode, HttpStatus, ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  // ── Overview ──────────────────────────────────────────────────────────────

  @Get('overview')
  @ApiOperation({
    summary: 'Dashboard overview',
    description:
      'Returns high-level school counts: total students, teachers, classes, subjects, ' +
      'current academic year, and current term.',
  })
  @ApiResponse({
    status: 200,
    description: 'Overview returned successfully.',
    schema: {
      example: {
        totalStudents: 320,
        totalTeachers: 24,
        totalClasses: 6,
        totalSubjects: 12,
        currentAcademicYear: '2024/2025',
        currentTerm: 'Term 1',
      },
    },
  })
  getOverview() { return this.service.getOverview(); }

  // ── Statistics ─────────────────────────────────────────────────────────────

  @Get('statistics')
  @ApiOperation({
    summary: 'Dashboard statistics',
    description:
      'Returns financial and admission statistics: fees collected, outstanding fees, ' +
      'new admissions in the last 30 days, and attendance placeholders.',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics returned successfully.',
    schema: {
      example: {
        feesCollected: 12500000,
        outstandingFees: 3200000,
        newAdmissions: 15,
        studentAttendance: 'Attendance module not yet connected',
        teacherAttendance: 'Attendance module not yet connected',
      },
    },
  })
  getStatistics() { return this.service.getStatistics(); }

  // ── Recent Activities ──────────────────────────────────────────────────────

  @Get('recent-activities')
  @ApiOperation({
    summary: 'Recent system activities',
    description:
      'Returns the latest 20 activities across student registrations, teacher additions, ' +
      'fee payments, and exam creations — sorted by most recent first.',
  })
  @ApiResponse({
    status: 200,
    description: 'Recent activities returned.',
    schema: {
      example: [
        { type: 'Student Registration', description: 'Brian Mukasa was registered in Senior Three', timestamp: '2024-02-10T08:23:00Z' },
        { type: 'Fee Payment', description: 'Receipt RCP-2024-00123 — UGX 850,000 received', timestamp: '2024-02-10T07:45:00Z' },
      ],
    },
  })
  getRecentActivities() { return this.service.getRecentActivities(); }

  // ── Announcements ──────────────────────────────────────────────────────────

  @Post('announcements')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create an announcement',
    description: 'Posts a new school-wide announcement with a publish date and optional expiry.',
  })
  @ApiBody({ type: CreateAnnouncementDto })
  @ApiResponse({ status: 201, description: 'Announcement created.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  createAnnouncement(@Body() dto: CreateAnnouncementDto) {
    return this.service.createAnnouncement(dto);
  }

  @Get('announcements')
  @ApiOperation({
    summary: 'Get all announcements',
    description: 'Returns all announcements ordered by publish date (newest first).',
  })
  @ApiResponse({ status: 200, description: 'All announcements returned.' })
  findAllAnnouncements() { return this.service.findAllAnnouncements(); }

  @Get('announcements/:id')
  @ApiOperation({ summary: 'Get a single announcement by UUID' })
  @ApiParam({ name: 'id', description: 'UUID of the announcement' })
  @ApiResponse({ status: 200, description: 'Announcement found.' })
  @ApiResponse({ status: 404, description: 'Announcement not found.' })
  findOneAnnouncement(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOneAnnouncement(id);
  }

  @Patch('announcements/:id')
  @ApiOperation({
    summary: 'Update an announcement',
    description: 'Partially updates an existing announcement. All fields are optional.',
  })
  @ApiParam({ name: 'id', description: 'UUID of the announcement' })
  @ApiBody({ type: UpdateAnnouncementDto })
  @ApiResponse({ status: 200, description: 'Announcement updated.' })
  @ApiResponse({ status: 404, description: 'Announcement not found.' })
  updateAnnouncement(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAnnouncementDto,
  ) {
    return this.service.updateAnnouncement(id, dto);
  }

  @Delete('announcements/:id')
  @ApiOperation({ summary: 'Delete an announcement' })
  @ApiParam({ name: 'id', description: 'UUID of the announcement' })
  @ApiResponse({
    status: 200,
    description: 'Announcement deleted.',
    schema: { example: { message: 'Announcement "School Closure Notice" deleted successfully.' } },
  })
  @ApiResponse({ status: 404, description: 'Announcement not found.' })
  removeAnnouncement(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.removeAnnouncement(id);
  }
}
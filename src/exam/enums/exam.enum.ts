export enum ExamStatus {
  DRAFT = 'Draft',
  SCHEDULED = 'Scheduled',
  ONGOING = 'Ongoing',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum Term {
  TERM_ONE = 'Term 1',
  TERM_TWO = 'Term 2',
  TERM_THREE = 'Term 3',
}

export enum ExamType {
  MIDTERM = 'Midterm',
  END_OF_TERM = 'End of Term',
  TEST = 'Test',
  QUIZ = 'Quiz',
  MOCK = 'Mock',
  FINAL_EXAM = 'Final Exam',
}

export enum GradingScale {
  STANDARD_A_F = 'Standard (A–F)',
  PERCENTAGE = 'Percentage',
  UGANDA_O_LEVEL = 'Uganda O-Level (D1–F9)',
  CUSTOM = 'Custom',
}

export enum AssignmentMethod {
  AUTOMATIC = 'Automatic',
  MANUAL = 'Manual',
}
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
  TEST = 'Test',
  QUIZ = 'Quiz',
  MIDTERM = 'Mid-Term',
  END_OF_TERM = 'End of Term',
  MOCK = 'Mock Exam',
  FINAL_EXAM = 'Final Exam',
}

export enum GradingScale {
  STANDARD_A_F = 'Standard (A–F)',
  PERCENTAGE_ONLY = 'Percentage Only',
  PASS_FAIL = 'Pass/Fail',
}

export enum AssignmentMethod {
  AUTOMATIC = 'Automatic',
  MANUAL = 'Manual',
}
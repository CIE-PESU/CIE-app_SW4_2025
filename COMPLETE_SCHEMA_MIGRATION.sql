-- ========================================
-- COMPLETE CONSOLIDATED SCHEMA MIGRATION
-- PostgreSQL-compatible (with idempotent checks)
-- Combines all migrations from the project
-- ========================================

BEGIN;

-- ensure extensions if needed


-- CreateEnum - User Roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole') THEN
        CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'FACULTY', 'STUDENT');
    END IF;
END$$;

-- CreateEnum - Course Status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coursestatus') THEN
        CREATE TYPE "CourseStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');
    END IF;
END$$;

-- CreateEnum - Project Status (with APPROVED added)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'projectstatus') THEN
        CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'ONGOING', 'COMPLETED', 'OVERDUE', 'REJECTED', 'APPROVED');
    END IF;
END$$;

-- CreateEnum - Submission Status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submissionstatus') THEN
        CREATE TYPE "SubmissionStatus" AS ENUM ('SUBMITTED', 'GRADED', 'REVISION_REQUESTED');
    END IF;
END$$;

-- CreateEnum - Attendance Status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendancestatus') THEN
        CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');
    END IF;
END$$;

-- CreateEnum - Request Status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'requeststatus') THEN
        CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COLLECTED', 'RETURNED', 'USER_RETURNED', 'OVERDUE');
    END IF;
END$$;

-- CreateEnum - Location Type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'locationtype') THEN
        CREATE TYPE "LocationType" AS ENUM ('LAB', 'CLASSROOM', 'OFFICE', 'WAREHOUSE', 'OTHER', 'CABIN', 'LECTURE_HALL', 'AUDITORIUM', 'SEMINAR_HALL');
    END IF;
END$$;

-- CreateEnum - Project Type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'projecttype') THEN
        CREATE TYPE "ProjectType" AS ENUM ('FACULTY_ASSIGNED', 'STUDENT_PROPOSED');
    END IF;
END$$;

-- CreateEnum - Project Request Status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'projectrequeststatus') THEN
        CREATE TYPE "ProjectRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
    END IF;
END$$;

-- CreateEnum - Opportunity Type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'opportunitytype') THEN
        CREATE TYPE "OpportunityType" AS ENUM ('TA', 'RA', 'INTERN');
    END IF;
END$$;

-- CreateEnum - Remuneration Type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'remunerationtype') THEN
        CREATE TYPE "RemunerationType" AS ENUM ('PAID', 'UNPAID');
    END IF;
END$$;

-- CreateEnum - Opportunity Status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'opportunitystatus') THEN
        CREATE TYPE "OpportunityStatus" AS ENUM ('OPEN', 'CLOSED', 'COMPLETED');
    END IF;
END$$;

-- CreateEnum - Application Status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'applicationstatus') THEN
        CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
    END IF;
END$$;

-- CreateEnum - Enrollment Status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enrollmentstatus') THEN
        CREATE TYPE "EnrollmentStatus" AS ENUM ('NOT_STARTED', 'OPEN', 'CLOSED');
    END IF;
END$$;

-- CreateEnum - Feedback Status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feedbackstatus') THEN
        CREATE TYPE "FeedbackStatus" AS ENUM ('PENDING', 'APPROVED', 'IN_PROGRESS', 'DONE', 'REJECTED', 'COMPLETED');
    END IF;
END$$;

-- ========================================
-- CORE TABLES
-- ========================================

-- Note: tables are created only if they do not already exist

-- CreateTable - Users
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "join_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable - Admins
CREATE TABLE IF NOT EXISTS "admins" (
    "id" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "office" TEXT NOT NULL,
    "permissions" TEXT[],
    "user_id" TEXT NOT NULL,
    "working_hours" TEXT NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable - Faculty
CREATE TABLE IF NOT EXISTS "faculty" (
    "id" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "office" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "office_hours" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "image_id" TEXT,
    "image_path" TEXT DEFAULT 'profile-img',
    "resume_id" TEXT,
    "resume_path" TEXT DEFAULT 'resumes',

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable - Students
CREATE TABLE IF NOT EXISTS "students" (
    "id" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "gpa" DOUBLE PRECISION,
    "advisor_id" TEXT,
    "student_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "resume_id" TEXT,
    "resume_path" TEXT DEFAULT 'resumes',

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- ========================================
-- COURSE TABLES
-- ========================================

-- CreateTable - Courses
CREATE TABLE IF NOT EXISTS "courses" (
    "id" TEXT NOT NULL,
    "course_description" TEXT NOT NULL,
    "course_end_date" TIMESTAMP NOT NULL,
    "course_enrollments" TEXT[],
    "course_name" TEXT NOT NULL,
    "course_start_date" TIMESTAMP NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_by" TEXT,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "course_code" TEXT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable - Course Units
CREATE TABLE IF NOT EXISTS "course_units" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "unit_number" INTEGER NOT NULL,
    "unit_name" TEXT NOT NULL,
    "unit_description" TEXT NOT NULL,
    "assignment_count" INTEGER NOT NULL DEFAULT 0,
    "hours_per_unit" INTEGER NOT NULL DEFAULT 1,
    "created_by" TEXT NOT NULL,
    "created_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_by" TEXT,
    "modified_date" TIMESTAMP NOT NULL,

    CONSTRAINT "course_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable - Enrollments
CREATE TABLE IF NOT EXISTS "enrollments" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "enrolled_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "student_id" TEXT NOT NULL,
    "grade" TEXT,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable - Class Schedules
CREATE TABLE IF NOT EXISTS "class_schedules" (
    "id" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "day_of_week" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "faculty_id" TEXT,
    "start_time" TEXT NOT NULL,

    CONSTRAINT "class_schedules_pkey" PRIMARY KEY ("id")
);

-- ========================================
-- PROJECT TABLES
-- ========================================

-- CreateTable - Projects (with enrollment fields and ai_prompt_custom)
CREATE TABLE IF NOT EXISTS "projects" (
    "id" TEXT NOT NULL,
    "accepted_by" TEXT,
    "components_needed" TEXT[],
    "course_id" TEXT,
    "created_by" TEXT NOT NULL,
    "created_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "expected_completion_date" TIMESTAMP NOT NULL,
    "modified_by" TEXT,
    "modified_date" TIMESTAMP NOT NULL,
    "name" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PENDING',
    "type" "ProjectType" NOT NULL DEFAULT 'FACULTY_ASSIGNED',
    "enrollment_cap" INTEGER,
    "enrollment_end_date" TIMESTAMP,
    "enrollment_start_date" TIMESTAMP,
    "enrollment_status" "EnrollmentStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "ai_prompt_custom" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable - Project Submissions
CREATE TABLE IF NOT EXISTS "project_submissions" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" TEXT[],
    "marks" INTEGER,
    "feedback" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "project_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "submission_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable - Project Requests (with resume fields)
CREATE TABLE IF NOT EXISTS "project_requests" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "request_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ProjectRequestStatus" NOT NULL DEFAULT 'PENDING',
    "student_notes" TEXT,
    "faculty_notes" TEXT,
    "accepted_date" TIMESTAMP,
    "rejected_date" TIMESTAMP,
    "resume_id" TEXT,
    "resume_path" TEXT,

    CONSTRAINT "project_requests_pkey" PRIMARY KEY ("id")
);

-- ========================================
-- ATTENDANCE TABLES
-- ========================================

-- CreateTable - Attendance Records
CREATE TABLE IF NOT EXISTS "attendance_records" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "date" TIMESTAMP NOT NULL,
    "course_id" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "faculty_id" TEXT,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable - Student Attendance
CREATE TABLE IF NOT EXISTS "student_attendance" (
    "id" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "attendance_record_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "student_attendance_pkey" PRIMARY KEY ("id")
);

-- ========================================
-- DOMAIN TABLES
-- ========================================

-- CreateTable - Domains
CREATE TABLE IF NOT EXISTS "domains" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable - Domain Coordinators
CREATE TABLE IF NOT EXISTS "domain_coordinators" (
    "id" TEXT NOT NULL,
    "domain_id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by" TEXT NOT NULL,

    CONSTRAINT "domain_coordinators_pkey" PRIMARY KEY ("id")
);

-- ========================================
-- LAB COMPONENT TABLES
-- ========================================

-- CreateTable - Lab Components (with individual items tracking)
CREATE TABLE IF NOT EXISTS "lab_components" (
    "id" TEXT NOT NULL,
    "component_name" TEXT NOT NULL,
    "component_description" TEXT NOT NULL,
    "component_specification" TEXT,
    "component_quantity" INTEGER NOT NULL,
    "component_tag_id" TEXT,
    "component_category" TEXT NOT NULL,
    "component_location" TEXT NOT NULL,
    "image_path" TEXT NOT NULL DEFAULT 'lab-images',
    "front_image_id" TEXT,
    "back_image_id" TEXT,
    "invoice_number" TEXT,
    "purchase_value" DECIMAL(10,2),
    "purchased_from" TEXT,
    "purchase_currency" TEXT NOT NULL DEFAULT 'INR',
    "purchase_date" TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "modified_by" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP NOT NULL,
    "domain_id" TEXT,
    "individual_items" JSONB,
    "track_individual" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "lab_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable - Component Requests
CREATE TABLE IF NOT EXISTS "component_requests" (
    "id" TEXT NOT NULL,
    "student_id" TEXT,
    "faculty_id" TEXT,
    "component_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "request_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "return_date" TIMESTAMP,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "approved_by" TEXT,
    "approved_date" TIMESTAMP,
    "project_id" TEXT,
    "purpose" TEXT,
    "required_date" TIMESTAMP,
    "faculty_notes" TEXT,
    "collection_date" TIMESTAMP,
    "due_date" TIMESTAMP,
    "fine_amount" DECIMAL(10,2),
    "fine_paid" BOOLEAN NOT NULL DEFAULT false,
    "payment_proof" TEXT,

    CONSTRAINT "component_requests_pkey" PRIMARY KEY ("id")
);

-- ========================================
-- LOCATION TABLES
-- ========================================

-- CreateTable - Locations
CREATE TABLE IF NOT EXISTS "locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "description" TEXT,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "building" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "floor" TEXT NOT NULL,
    "images" TEXT[],
    "location_type" "LocationType" NOT NULL,
    "modified_by" TEXT,
    "modified_date" TIMESTAMP NOT NULL,
    "room_number" TEXT NOT NULL,
    "wing" TEXT,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable - Location Bookings
CREATE TABLE IF NOT EXISTS "location_bookings" (
    "id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "faculty_id" TEXT,
    "start_time" TIMESTAMP NOT NULL,
    "end_time" TIMESTAMP NOT NULL,
    "purpose" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "location_bookings_pkey" PRIMARY KEY ("id")
);

-- ========================================
-- LIBRARY TABLES
-- ========================================

-- CreateTable - Library Items
CREATE TABLE IF NOT EXISTS "library_items" (
    "id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "item_description" TEXT NOT NULL,
    "item_specification" TEXT,
    "item_quantity" INTEGER NOT NULL,
    "item_tag_id" TEXT,
    "item_category" TEXT NOT NULL,
    "item_location" TEXT NOT NULL,
    "image_path" TEXT NOT NULL DEFAULT 'library-images',
    "front_image_id" TEXT,
    "back_image_id" TEXT,
    "invoice_number" TEXT,
    "purchase_value" DECIMAL(10,2),
    "purchased_from" TEXT,
    "purchase_currency" TEXT NOT NULL DEFAULT 'INR',
    "purchase_date" TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "modified_by" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "available_quantity" INTEGER NOT NULL DEFAULT 0,
    "faculty_id" TEXT,
    "domain_id" TEXT,
    "modified_at" TIMESTAMP NOT NULL,

    CONSTRAINT "library_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable - Library Requests
CREATE TABLE IF NOT EXISTS "library_requests" (
    "id" TEXT NOT NULL,
    "student_id" TEXT,
    "item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "purpose" TEXT,
    "request_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "required_date" TIMESTAMP,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "collection_date" TIMESTAMP,
    "return_date" TIMESTAMP,
    "notes" TEXT,
    "faculty_notes" TEXT,
    "faculty_id" TEXT,
    "due_date" TIMESTAMP,
    "fine_amount" DECIMAL(10,2),
    "fine_paid" BOOLEAN NOT NULL DEFAULT false,
    "payment_proof" TEXT,

    CONSTRAINT "library_requests_pkey" PRIMARY KEY ("id")
);

-- ========================================
-- OPPORTUNITY TABLES
-- ========================================

-- CreateTable - Opportunity
CREATE TABLE IF NOT EXISTS "Opportunity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "OpportunityType" NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP NOT NULL,
    "applicationStartDate" TIMESTAMP NOT NULL,
    "applicationEndDate" TIMESTAMP NOT NULL,
    "remuneration" "RemunerationType" NOT NULL,
    "filePath" TEXT,
    "facultyInChargeId" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" "OpportunityStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable - OpportunityApplication (with resume fields)
CREATE TABLE IF NOT EXISTS "OpportunityApplication" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "resumePath" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "appliedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "resumeData" BYTEA,
    "resumeName" TEXT,

    CONSTRAINT "OpportunityApplication_pkey" PRIMARY KEY ("id")
);

-- ========================================
-- PLATFORM MANAGEMENT TABLES
-- ========================================

-- CreateTable - Platform Manager Assignments
CREATE TABLE IF NOT EXISTS "platform_manager_assignments" (
    "id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by" TEXT NOT NULL,

    CONSTRAINT "platform_manager_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable - Developer Assignments
CREATE TABLE IF NOT EXISTS "developer_assignments" (
    "id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by" TEXT NOT NULL,

    CONSTRAINT "developer_assignments_pkey" PRIMARY KEY ("id")
);

-- ========================================
-- FEEDBACK TABLES
-- ========================================

-- CreateTable - Feedbacks
CREATE TABLE IF NOT EXISTS "feedbacks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'PENDING',
    "created_by" TEXT NOT NULL,
    "approved_by" TEXT,
    "approved_at" TIMESTAMP,
    "completed_at" TIMESTAMP,
    "category" TEXT,
    "image" TEXT,
    "rectifiedImage" TEXT,
    "rejectionReason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- ========================================
-- INDEXES
-- ========================================

-- create indexes only if they do not exist already

-- Users Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- Admins Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "admins_user_id_key" ON "admins"("user_id");

-- Faculty Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "faculty_faculty_id_key" ON "faculty"("faculty_id");
CREATE UNIQUE INDEX IF NOT EXISTS "faculty_user_id_key" ON "faculty"("user_id");

-- Students Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "students_student_id_key" ON "students"("student_id");
CREATE UNIQUE INDEX IF NOT EXISTS "students_user_id_key" ON "students"("user_id");

-- Courses Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "courses_course_code_key" ON "courses"("course_code");

-- Course Units Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "course_units_course_id_unit_number_key" ON "course_units"("course_id", "unit_number");

-- Enrollments Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "enrollments_student_id_course_id_key" ON "enrollments"("student_id", "course_id");

-- Project Submissions Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "project_submissions_project_id_student_id_key" ON "project_submissions"("project_id", "student_id");

-- Project Requests Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "project_requests_project_id_student_id_key" ON "project_requests"("project_id", "student_id");

-- Student Attendance Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "student_attendance_attendance_record_id_student_id_key" ON "student_attendance"("attendance_record_id", "student_id");

-- Domains Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "domains_name_key" ON "domains"("name");

-- Domain Coordinators Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "domain_coordinators_domain_id_faculty_id_key" ON "domain_coordinators"("domain_id", "faculty_id");

-- Platform Manager Assignments Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "platform_manager_assignments_faculty_id_key" ON "platform_manager_assignments"("faculty_id");

-- Developer Assignments Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "developer_assignments_faculty_id_key" ON "developer_assignments"("faculty_id");

-- ========================================
-- FOREIGN KEYS
-- ========================================

-- add foreign key constraints idempotently using ALTER TABLE

-- Admins Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'admins_user_id_fkey') THEN
        ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;

-- Faculty Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'faculty_user_id_fkey') THEN
        ALTER TABLE "faculty" ADD CONSTRAINT "faculty_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;

-- Students Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'students_user_id_fkey') THEN
        ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;

-- Course Units Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'course_units_course_id_fkey') THEN
        ALTER TABLE "course_units" ADD CONSTRAINT "course_units_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;

-- Enrollments Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'enrollments_course_id_fkey') THEN
        ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'enrollments_student_id_fkey') THEN
        ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END$$;

-- Class Schedules Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'class_schedules_course_id_fkey') THEN
        ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'class_schedules_faculty_id_fkey') THEN
        ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END$$;

-- Project Submissions Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'project_submissions_project_id_fkey') THEN
        ALTER TABLE "project_submissions" ADD CONSTRAINT "project_submissions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'project_submissions_student_id_fkey') THEN
        ALTER TABLE "project_submissions" ADD CONSTRAINT "project_submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END$$;

-- Project Requests Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'project_requests_faculty_id_fkey') THEN
        ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'project_requests_project_id_fkey') THEN
        ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'project_requests_student_id_fkey') THEN
        ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END$$;

-- Attendance Records Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'attendance_records_faculty_id_fkey') THEN
        ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END$$;

-- Student Attendance Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'student_attendance_attendance_record_id_fkey') THEN
        ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_attendance_record_id_fkey" FOREIGN KEY ("attendance_record_id") REFERENCES "attendance_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'student_attendance_student_id_fkey') THEN
        ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END$$;

-- Domain Coordinators Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'domain_coordinators_domain_id_fkey') THEN
        ALTER TABLE "domain_coordinators" ADD CONSTRAINT "domain_coordinators_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'domain_coordinators_faculty_id_fkey') THEN
        ALTER TABLE "domain_coordinators" ADD CONSTRAINT "domain_coordinators_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;

-- Lab Components Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'lab_components_domain_id_fkey') THEN
        ALTER TABLE "lab_components" ADD CONSTRAINT "lab_components_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END$$;

-- Component Requests Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'component_requests_approved_by_fkey') THEN
        ALTER TABLE "component_requests" ADD CONSTRAINT "component_requests_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'component_requests_faculty_id_fkey') THEN
        ALTER TABLE "component_requests" ADD CONSTRAINT "component_requests_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'component_requests_component_id_fkey') THEN
        ALTER TABLE "component_requests" ADD CONSTRAINT "component_requests_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "lab_components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'component_requests_project_id_fkey') THEN
        ALTER TABLE "component_requests" ADD CONSTRAINT "component_requests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'component_requests_student_id_fkey') THEN
        ALTER TABLE "component_requests" ADD CONSTRAINT "component_requests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END$$;

-- Location Bookings Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'location_bookings_faculty_id_fkey') THEN
        ALTER TABLE "location_bookings" ADD CONSTRAINT "location_bookings_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'location_bookings_location_id_fkey') THEN
        ALTER TABLE "location_bookings" ADD CONSTRAINT "location_bookings_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;

-- Library Items Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'library_items_faculty_id_fkey') THEN
        ALTER TABLE "library_items" ADD CONSTRAINT "library_items_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'library_items_domain_id_fkey') THEN
        ALTER TABLE "library_items" ADD CONSTRAINT "library_items_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END$$;

-- Library Requests Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'library_requests_item_id_fkey') THEN
        ALTER TABLE "library_requests" ADD CONSTRAINT "library_requests_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "library_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'library_requests_student_id_fkey') THEN
        ALTER TABLE "library_requests" ADD CONSTRAINT "library_requests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'library_requests_faculty_id_fkey') THEN
        ALTER TABLE "library_requests" ADD CONSTRAINT "library_requests_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END$$;

-- Opportunity Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Opportunity_facultyInChargeId_fkey') THEN
        ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_facultyInChargeId_fkey" FOREIGN KEY ("facultyInChargeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END$$;

-- OpportunityApplication Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'OpportunityApplication_opportunityId_fkey') THEN
        ALTER TABLE "OpportunityApplication" ADD CONSTRAINT "OpportunityApplication_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END$$;
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'OpportunityApplication_studentId_fkey') THEN
        ALTER TABLE "OpportunityApplication" ADD CONSTRAINT "OpportunityApplication_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END$$;

-- Platform Manager Assignments Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'platform_manager_assignments_faculty_id_fkey') THEN
        ALTER TABLE "platform_manager_assignments" ADD CONSTRAINT "platform_manager_assignments_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;

-- Developer Assignments Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        WHERE tc.constraint_name = 'developer_assignments_faculty_id_fkey'
    ) THEN
        ALTER TABLE "developer_assignments" ADD CONSTRAINT "developer_assignments_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;

COMMIT;

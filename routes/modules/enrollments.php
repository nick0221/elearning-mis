<?php

use App\Http\Controllers\EnrollmentController;
use Illuminate\Support\Facades\Route;

Route::post('courses/{course}/enroll', [EnrollmentController::class, 'store'])->name('courses.enroll');
Route::delete('courses/{course}/unenroll', [EnrollmentController::class, 'destroy'])->name('courses.unenroll');
Route::get('my-courses', [EnrollmentController::class, 'myCourses'])->name('courses.my');
Route::get('courses/{course}/learn', [EnrollmentController::class, 'learn'])->name('courses.learn');
Route::post('lessons/{lesson}/complete', [EnrollmentController::class, 'completeLesson'])->name('lessons.complete');

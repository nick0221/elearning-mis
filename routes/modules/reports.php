<?php

use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::middleware('permission:view system analytics|view course analytics')->prefix('reports')->name('reports.')->group(function () {
    Route::get('/', [ReportController::class, 'index'])->name('index');
    Route::get('/enrollments', [ReportController::class, 'enrollments'])->name('enrollments');
    Route::get('/performance', [ReportController::class, 'performance'])->name('performance');
    Route::get('/activity', [ReportController::class, 'activity'])->name('activity');
    Route::get('/export/{type}', [ReportController::class, 'export'])->name('export');
});

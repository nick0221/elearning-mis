<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('permission:manage users')->group(function () {
    Route::resource('users', UserController::class);
});

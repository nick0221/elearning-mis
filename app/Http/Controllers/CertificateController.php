<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function download(Request $request, Course $course)
    {
        $user = $request->user();

        $enrollment = $course->enrollments()
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->first();

        if (! $enrollment) {
            return back()->with('error', 'You must complete the course before downloading a certificate.');
        }

        $pdf = Pdf::loadView('certificates.default', [
            'course' => $course,
            'enrollment' => $enrollment,
        ]);

        $filename = 'certificate-'.str($course->title)->slug().'.pdf';

        return $pdf->download($filename);
    }
}

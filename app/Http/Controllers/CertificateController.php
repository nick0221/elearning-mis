<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
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

        $certificate = Certificate::firstOrCreate(
            ['user_id' => $user->id, 'course_id' => $course->id],
            [
                'enrollment_id' => $enrollment->id,
                'certificate_number' => Certificate::generateNumber(),
                'issued_at' => now(),
            ]
        );

        $pdf = Pdf::loadView('certificates.default', [
            'course' => $course,
            'enrollment' => $enrollment,
            'certificate' => $certificate,
        ]);

        $filename = 'certificate-'.str($course->title)->slug().'.pdf';

        return $pdf->download($filename);
    }
}

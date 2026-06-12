<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificate of Completion</title>
    <style>
        @page { margin: 0; }
        body {
            margin: 0;
            padding: 0;
            font-family: 'DejaVu Sans', sans-serif;
            background: #fafafa;
        }
        .certificate-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            box-sizing: border-box;
        }
        .certificate {
            width: 100%;
            max-width: 900px;
            border: 8px double #1a1a2e;
            padding: 50px;
            text-align: center;
            background: white;
            position: relative;
        }
        .certificate::before {
            content: '';
            position: absolute;
            top: 15px;
            left: 15px;
            right: 15px;
            bottom: 15px;
            border: 1px solid #e2e8f0;
            pointer-events: none;
        }
        .badge {
            font-size: 60px;
            margin-bottom: 10px;
            color: #1a1a2e;
        }
        h1 {
            font-size: 36px;
            color: #1a1a2e;
            margin: 0 0 5px;
            letter-spacing: 4px;
            text-transform: uppercase;
        }
        .subtitle {
            font-size: 14px;
            color: #64748b;
            letter-spacing: 6px;
            text-transform: uppercase;
            margin-bottom: 30px;
        }
        .presented {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 5px;
        }
        .recipient {
            font-size: 42px;
            font-weight: bold;
            color: #1a1a2e;
            margin: 10px 0;
            border-bottom: 2px solid #e2e8f0;
            border-top: 2px solid #e2e8f0;
            padding: 15px 0;
        }
        .course-name {
            font-size: 22px;
            color: #2563eb;
            margin: 10px 0 5px;
        }
        .description {
            font-size: 13px;
            color: #64748b;
            margin: 15px 0 30px;
            line-height: 1.6;
        }
        .details {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
        }
        .details div { text-align: center; }
        .details .label { text-transform: uppercase; letter-spacing: 2px; font-size: 10px; margin-bottom: 4px; }
        .details .value { font-size: 14px; color: #1a1a2e; font-weight: bold; }
    </style>
</head>
<body>
    <div class="certificate-wrapper">
        <div class="certificate">
            <div class="badge">&#9733;</div>
            <h1>Certificate of Completion</h1>
            <p class="subtitle">Proudly Presented To</p>

            <div class="recipient">{{ $enrollment->user->name }}</div>

            <p class="presented">For successfully completing the course</p>
            <div class="course-name">{{ $course->title }}</div>

            <p class="description">
                {{ $course->description ?? 'This certificate acknowledges the dedication and effort demonstrated throughout the course.' }}
            </p>

            <div class="details">
                <div>
                    <div class="label">Date</div>
                    <div class="value">{{ $enrollment->completed_at?->format('F d, Y') ?? now()->format('F d, Y') }}</div>
                </div>
                <div>
                    <div class="label">Duration</div>
                    <div class="value">{{ $course->estimated_duration_minutes ?? '—' }} minutes</div>
                </div>
                <div>
                    <div class="label">Certificate ID</div>
                    <div class="value">#{{ $course->id }}-{{ $enrollment->id }}</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

declare namespace App {
    interface User {
        id: number;
        name: string;
        email: string;
        avatar?: string;
        roles: string[];
        permissions: string[];
    }

    interface PageProps {
        auth: {
            user: User | null;
        };
        flash: {
            success: string | null;
            error: string | null;
        };
        [key: string]: unknown;
    }
}

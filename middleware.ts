import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface AuthenticatedRequest extends NextRequest {
    nextauth: {
        token: any;
    };
}

export default withAuth(
    function middleware(req: NextRequest) {
        const token = (req as AuthenticatedRequest).nextauth?.token;
        if (token) {
            return NextResponse.redirect(new URL("/files", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: () => true,
        },
    }
);

export const config = {
    matcher: ["/signin", "/signup"]
};

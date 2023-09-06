import { HttpError, Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: HttpError, request: any, response: any, next: (err: any) => any): void {
        // Logging the error
        console.error('An error occurred:', error);

        // Custom error response
        response.status(error.httpCode || 500).json({
            message: error.message || 'Internal Server Error',
            error: error.name || 'ServerError',
        });

        next(error);
    }
}

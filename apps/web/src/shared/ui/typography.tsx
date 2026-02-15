import { cn } from '@/shared/lib/utils';

function TypographyH1({
    className,
    children,
    ...props
}: React.ComponentProps<'h1'>) {
    return (
        <h1
            className={cn(
                'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
                className
            )}
            {...props}
        >
            {children}
        </h1>
    );
}

function TypographyH2({
    className,
    children,
    ...props
}: React.ComponentProps<'h2'>) {
    return (
        <h2
            className={cn(
                'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
                className
            )}
            {...props}
        >
            {children}
        </h2>
    );
}

function TypographyH3({
    className,
    children,
    ...props
}: React.ComponentProps<'h3'>) {
    return (
        <h3
            className={cn(
                'scroll-m-20 text-2xl font-semibold tracking-tight',
                className
            )}
            {...props}
        >
            {children}
        </h3>
    );
}

function TypographyP({
    className,
    children,
    ...props
}: React.ComponentProps<'p'>) {
    return (
        <p
            className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
            {...props}
        >
            {children}
        </p>
    );
}

function TypographyLarge({
    className,
    children,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div className={cn('text-lg font-semibold', className)} {...props}>
            {children}
        </div>
    );
}

function TypographySmall({
    className,
    children,
    ...props
}: React.ComponentProps<'small'>) {
    return (
        <small
            className={cn('text-sm leading-none font-medium', className)}
            {...props}
        >
            {children}
        </small>
    );
}

function TypographyMuted({
    className,
    children,
    ...props
}: React.ComponentProps<'p'>) {
    return (
        <p
            className={cn('text-muted-foreground text-sm', className)}
            {...props}
        >
            {children}
        </p>
    );
}

const Typography = {
    H1: TypographyH1,
    H2: TypographyH2,
    H3: TypographyH3,
    P: TypographyP,
    Large: TypographyLarge,
    Small: TypographySmall,
    Muted: TypographyMuted,
};

export default Typography;

interface Props {
    progress: number;
    title: string;
    subtitle: string;
    stepIndicator?: string;
    children?: React.ReactNode;
}

const FormWrapper = ({ progress, subtitle, title, stepIndicator, children }: Props) => {
    return (
        <div className="bg-card flex w-fit max-w-[800px] flex-col items-center justify-center overflow-hidden rounded-xl p-0 shadow-md">
            <div className="mb-5 w-full p-[5px]">
                <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
                    <div
                        className="bg-primary h-full transition-[width] duration-300"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
            <div className="flex w-full flex-col gap-2.5 px-5 md:px-[30px] md:pt-5">
                <div className="flex items-baseline justify-between gap-4">
                    <h1 className="text-foreground text-2xl font-bold">{title}</h1>
                    {stepIndicator && (
                        <span className="text-muted-foreground text-sm font-medium whitespace-nowrap">
                            {stepIndicator}
                        </span>
                    )}
                </div>
                <p className="text-muted-foreground text-lg">{subtitle}</p>
            </div>

            <div className="w-full px-5 pt-[5px] pb-[15px] md:p-[30px]">{children}</div>
        </div>
    );
};

export default FormWrapper;

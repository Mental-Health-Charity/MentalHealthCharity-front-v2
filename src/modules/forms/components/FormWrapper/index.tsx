interface Props {
    progress: number;
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}

const FormWrapper = ({ progress, subtitle, title, children }: Props) => {
    return (
        <div className="bg-bg-brand/75 flex w-fit max-w-[800px] flex-col items-center justify-center overflow-hidden rounded-[4px] p-0 shadow-md backdrop-blur-[15px]">
            <div className="mb-5 w-full p-[5px]">
                <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
                    <div
                        className="bg-primary h-full transition-[width] duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2.5 px-5 md:px-[30px] md:pt-5">
                <h1 className="text-dark text-2xl font-bold">{title}</h1>
                <p className="text-dark text-xl">{subtitle}</p>
            </div>

            <div className="w-full px-5 pt-[5px] pb-[15px] md:p-[30px]">{children}</div>
        </div>
    );
};

export default FormWrapper;

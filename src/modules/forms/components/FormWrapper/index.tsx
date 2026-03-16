import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
    progress: number;
    title: string;
    subtitle: string;
    stepIndicator?: string;
    children?: React.ReactNode;
    direction?: number;
}

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 60 : -60,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 60 : -60,
        opacity: 0,
    }),
};

const FormWrapper = ({ progress, subtitle, title, stepIndicator, children, direction = 1 }: Props) => {
    return (
        <div className="bg-card flex w-full max-w-[560px] flex-col overflow-hidden rounded-2xl shadow-lg">
            {/* Progress line */}
            <div className="bg-muted/50 relative h-1 w-full overflow-hidden">
                <motion.div
                    className="bg-primary-brand absolute inset-y-0 left-0"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>

            <div className="flex flex-col px-6 pt-8 pb-6 md:px-10 md:pt-10 md:pb-8">
                {/* Step indicator pill */}
                {stepIndicator && (
                    <span className="text-primary-brand bg-primary-brand/10 mb-4 w-fit rounded-full px-3 py-1 text-xs font-semibold">
                        {stepIndicator}
                    </span>
                )}

                {/* Animated header */}
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={title}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="mb-8"
                    >
                        <h1 className={cn("text-foreground text-2xl font-bold md:text-3xl")}>{title}</h1>
                        <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">{subtitle}</p>
                    </motion.div>
                </AnimatePresence>

                {/* Animated content */}
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={title + "-content"}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut", delay: 0.05 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FormWrapper;

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, FileText, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import systemUsageInfographic from "../assets/static/courses/system_usage_infographic_assets_1_pl.png";
import volunteerCheatSheet from "../assets/static/courses/volunteer_cheat_sheet_pl.png";
import volunteerHandbookPart1 from "../assets/static/courses/volunteer_handbook_part_1_pl.pdf";
import volunteerHandbookPart2 from "../assets/static/courses/volunteer_handbook_part_2_pl.pdf";
import AnimatedSection from "../modules/shared/components/AnimatedSection";
import Card from "../modules/shared/components/Card";
import Container from "../modules/shared/components/Container";

type TrainingAsset = {
    id: string;
    title: string;
    description: string;
    file: string;
    kind: "image" | "pdf";
    format: string;
};

const TrainingsScreen = () => {
    const { t } = useTranslation();

    const trainings: TrainingAsset[] = [
        {
            id: "handbook-part-1",
            title: t("trainings.items.handbook_part_1.title"),
            description: t("trainings.items.handbook_part_1.description"),
            file: volunteerHandbookPart1,
            kind: "pdf",
            format: "PDF",
        },
        {
            id: "handbook-part-2",
            title: t("trainings.items.handbook_part_2.title"),
            description: t("trainings.items.handbook_part_2.description"),
            file: volunteerHandbookPart2,
            kind: "pdf",
            format: "PDF",
        },
        {
            id: "cheat-sheet",
            title: t("trainings.items.cheat_sheet.title"),
            description: t("trainings.items.cheat_sheet.description"),
            file: volunteerCheatSheet,
            kind: "image",
            format: "PNG",
        },
        {
            id: "system-usage",
            title: t("trainings.items.system_usage.title"),
            description: t("trainings.items.system_usage.description"),
            file: systemUsageInfographic,
            kind: "image",
            format: "PNG",
        },
    ];

    return (
        <div>
            <div className="from-primary-brand-50 to-background bg-gradient-to-b px-5 pt-12 pb-8 md:pt-20 md:pb-12">
                <div className="mx-auto flex max-w-[1200px] flex-col gap-3">
                    <p className="text-primary-brand text-sm font-semibold tracking-[0.24em] uppercase">
                        {t("trainings.eyebrow")}
                    </p>
                    <h1 className="text-foreground text-3xl font-bold md:text-4xl">{t("trainings.title")}</h1>
                    <p className="text-muted-foreground max-w-[720px] text-base md:text-lg">
                        {t("trainings.subtitle")}
                    </p>
                </div>
            </div>

            <Container className="pb-12">
                <div className="grid gap-8 md:grid-cols-2">
                    {trainings.map((training, index) => {
                        const previewTitle = t("trainings.preview_title", { title: training.title });
                        return (
                            <AnimatedSection as="article" key={training.id} delay={index * 90}>
                                <Card className="flex h-full flex-col gap-6 md:gap-7">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="info">{training.format}</Badge>
                                            <Badge variant="outline">{t("common.preview")}</Badge>
                                        </div>
                                        <span className="text-muted-foreground">
                                            {training.kind === "pdf" ? (
                                                <FileText className="size-4" aria-hidden="true" />
                                            ) : (
                                                <ImageIcon className="size-4" aria-hidden="true" />
                                            )}
                                        </span>
                                    </div>

                                    <div className="bg-muted/40 border-border/60 mt-2 overflow-hidden rounded-xl border md:mt-3">
                                        {training.kind === "pdf" ? (
                                            <iframe
                                                title={previewTitle}
                                                src={`${training.file}#page=1&view=fitH`}
                                                className="h-[320px] w-full"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <img
                                                src={training.file}
                                                alt={previewTitle}
                                                className="h-[320px] w-full object-cover"
                                                loading="lazy"
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 mt-4 flex flex-col gap-0">
                                        <h2 className="text-foreground text-xl font-semibold md:text-2xl">
                                            {training.title}
                                        </h2>
                                        <p className="text-muted-foreground text-sm md:text-base">
                                            {training.description}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <Button
                                            variant="outline"
                                            render={<a href={training.file} target="_blank" rel="noreferrer" />}
                                        >
                                            <ExternalLink className="size-4" />
                                            {t("trainings.open")}
                                        </Button>
                                        <Button render={<a href={training.file} download />}>
                                            <Download className="size-4" />
                                            {t("common.download")}
                                        </Button>
                                    </div>
                                </Card>
                            </AnimatedSection>
                        );
                    })}
                </div>
            </Container>
        </div>
    );
};

export default TrainingsScreen;

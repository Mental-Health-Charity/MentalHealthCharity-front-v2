import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Permissions } from "../../../shared/constants";
import usePermissions from "../../../shared/hooks/usePermissions";

interface Props {
    onSearch: (query: string) => void;
    search: string;
}

const ArticlesHeading = ({ onSearch, search }: Props) => {
    const { t } = useTranslation();
    const { hasPermissions } = usePermissions();

    return (
        <div className="flex flex-wrap gap-3 md:flex-nowrap">
            <div className="bg-card/80 flex flex-1 items-center gap-2 rounded-full border px-4 py-2.5 backdrop-blur-sm">
                <Search className="text-muted-foreground size-4 shrink-0" />
                <label htmlFor="articles-search" className="sr-only">
                    {t("common.search")}
                </label>
                <input
                    id="articles-search"
                    className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
                    placeholder={t("common.search")}
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
            {hasPermissions(Permissions.CREATE_ARTICLE) && (
                <Button className="gap-1.5 rounded-full" render={<Link to="/articles/dashboard" />}>
                    <PlusCircle className="size-5" />
                    {t("articles.add_article")}
                </Button>
            )}
        </div>
    );
};

export default ArticlesHeading;

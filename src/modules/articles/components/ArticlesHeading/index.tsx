import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
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
        <>
            <Card className="mx-auto mb-5 w-full p-[15px]">
                <div className="flex flex-wrap gap-5 md:flex-nowrap">
                    <Input placeholder={t("common.search")} value={search} onChange={(e) => onSearch(e.target.value)} />
                    {hasPermissions(Permissions.CREATE_ARTICLE) && (
                        <Button className="w-[300px] gap-[5px]" render={<Link to="/articles/dashboard" />}>
                            <PlusCircle className="size-6" />
                            {t("articles.add_article")}
                        </Button>
                    )}
                </div>
            </Card>
        </>
    );
};

export default ArticlesHeading;

import { useEffect, useState } from "react"
import { Eye, Newspaper } from "lucide-react"
import { useToast } from "../../hooks/useToast"
import { DashboardCard } from "../../components/cards/DashboardCard"
import { DataTable } from "../../components/table/DataTable"
import { createCategoriesTableActions } from "../../helpers/dataTable/categoriesTableActionsRow"
import { categoriesColumns } from "../../helpers/dataTable/categoriesColumns"
import type { Category } from "../../helpers/types/Category"
import { AddCategory } from "../../components/forms/AddCategory"
import "../../styles/pages/contents/categories.scss"

export const CategoriesPage = () => {

  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [])

  return (
    <div className="main-pane app-categories-page">
      <div className="list-pane">
        <h1>Catégories</h1>
        <div className='cards-container'>
          <DashboardCard icon={Newspaper} title="Total" value={categories.length} small />
          <DashboardCard icon={Eye} title="Visibles" value={categories.reduce((acc, item) => acc + (item.visible ? 1 : 0), 0)} small />
        </div>
        <div className='table-container'>
          <DataTable
            data={categories}
            columns={categoriesColumns}
            getRowId={(item, index) => `${item.title}-${index}`}
            rowActions={createCategoriesTableActions({ fetchCategories, showToast })}
            isLoading={isLoading}
            loadingLabel="Chargement des catégories…"
            emptyLabel="Aucune catégorie disponible pour le moment."
          />
        </div>
      </div>
      <div className="form-pane">
        <h1>Ajouter une catégorie</h1>
        <AddCategory onCategoryAdded={fetchCategories} />
      </div>
    </div>
  );
}

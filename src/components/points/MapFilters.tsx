"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Filter, Star, X } from "lucide-react";
import { Category } from "@/types";

export interface MapFilters {
  categories: string[];
  minRating: number | null;
}

interface MapFiltersComponentProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
}

const STAR_OPTIONS = [1, 2, 3, 4, 5];

export default function MapFiltersComponent({
  filters,
  onFiltersChange,
}: MapFiltersComponentProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId];

    onFiltersChange({
      ...filters,
      categories: newCategories,
    });
  };

  const handleRatingChange = (rating: number) => {
    const newRating = filters.minRating === rating ? null : rating;
    onFiltersChange({
      ...filters,
      minRating: newRating,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      minRating: null,
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 || filters.minRating !== null;
  const selectedCategoriesCount = filters.categories.length;

  const getSelectedCategoriesNames = () => {
    return categories
      .filter((cat) => filters.categories.includes(cat._id))
      .map((cat) => cat.name);
  };

  return (
    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-[1000]">
      <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-md border-0">
        <div className="flex items-center gap-2 px-1 py-1">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <div className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-white hover:bg-gray-50 border border-gray-300 rounded cursor-pointer transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
                {hasActiveFilters && (
                  <div className="flex items-center justify-center w-5 h-5 text-xs bg-blue-500 text-white rounded-full ml-1">
                    {selectedCategoriesCount + (filters.minRating ? 1 : 0)}
                  </div>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="center">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Filtros</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                    >
                      Limpiar todo
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Categories Filter */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">
                    Categorías
                  </h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {categories.map((category) => (
                      <div
                        key={category._id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={category._id}
                          checked={filters.categories.includes(category._id)}
                          onCheckedChange={() =>
                            handleCategoryToggle(category._id)
                          }
                        />
                        <label
                          htmlFor={category._id}
                          className="text-sm cursor-pointer hover:text-gray-700"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Rating Filter */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">
                    Puntuación mínima
                  </h5>
                  <div className="flex items-center gap-1">
                    {STAR_OPTIONS.map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleRatingChange(rating)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
                          filters.minRating === rating
                            ? "bg-yellow-100 text-yellow-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            filters.minRating === rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-400"
                          }`}
                        />
                        <span>{rating}+</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-1 max-w-md overflow-x-auto">
              {getSelectedCategoriesNames().map((categoryName) => (
                <Badge
                  key={categoryName}
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer h-6 px-1.5 text-xs"
                  onClick={() => {
                    const category = categories.find(
                      (c) => c.name === categoryName
                    );
                    if (category) handleCategoryToggle(category._id);
                  }}
                >
                  {categoryName}
                  <X className="w-2 h-2 ml-1" />
                </Badge>
              ))}
              {filters.minRating && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 cursor-pointer h-6 px-1.5 text-xs"
                  onClick={() => handleRatingChange(filters.minRating!)}
                >
                  <Star className="w-2 h-2 mr-1 fill-yellow-400 text-yellow-400" />
                  {filters.minRating}+
                  <X className="w-2 h-2 ml-1" />
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

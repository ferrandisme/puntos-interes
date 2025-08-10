"use client";
import { useEffect, useState } from "react";
import { Point } from "@/types";
import { useSession } from "@/utils/auth-client";
import { usePointVote } from "@/hooks/use-point-vote";
import StarRating from "@/components/ui/star-rating";

interface PointDetailsProps {
  id: string;
}

export default function PointDetails({ id }: PointDetailsProps) {
  const [point, setPoint] = useState<Point>();
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const { userHasVoted, userVote, isVoting, submitVote } = usePointVote(id);

  useEffect(() => {
    const fetchPoint = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/points/" + id);
        const data = await response.json();
        setPoint(data);
      } catch (error) {
        console.error("Error fetching point:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoint();
  }, [id]);

  const handleVote = async (score: number) => {
    const success = await submitVote(score);
    if (success) {
      // Refrescar los datos del punto para obtener la nueva puntuación
      const pointResponse = await fetch("/api/points/" + id);
      if (pointResponse.ok) {
        const updatedPoint = await pointResponse.json();
        setPoint(updatedPoint);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 min-w-[250px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-[250px] max-w-[300px] p-2">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{point?.name}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            {point?.category?.name}
          </span>
          {/* <span className="text-xs text-gray-500">Por: {point?.author}</span> */}
        </div>
      </div>

      {point?.description && (
        <div className="text-sm text-gray-700 leading-relaxed mb-4">
          {point.description}
        </div>
      )}

      {/* Rating y votación */}
      <div className="border-t pt-3 mt-3">
        <div className="flex items-center justify-center mb-3">
          <span className="text-sm font-medium text-gray-700">
            {point?.rating && point?.votes ? (
              <>
                {point.rating.toFixed(1)}⭐ ({point.votes} voto
                {point.votes !== 1 ? "s" : ""})
              </>
            ) : (
              "Sin calificar aún"
            )}
          </span>
        </div>

        {session?.user && (
          <div className="mt-3">
            <div className="text-center">
              <p className="text-xs text-gray-700 mb-2">
                {userHasVoted
                  ? "Cambiar tu calificación:"
                  : "Califica este lugar:"}
              </p>
              <StarRating
                rating={userVote}
                onRatingChange={handleVote}
                size="md"
                centered={true}
              />
              {userHasVoted && (
                <p className="text-xs text-gray-500 mt-1">
                  Haz clic en una estrella para cambiar tu voto
                </p>
              )}
              {isVoting && (
                <p className="text-xs text-blue-600 mt-1">
                  {userHasVoted ? "Actualizando voto..." : "Enviando voto..."}
                </p>
              )}
            </div>
          </div>
        )}

        {!session?.user && (
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500">
              Inicia sesión para calificar este lugar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

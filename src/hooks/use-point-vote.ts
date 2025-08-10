import { useState, useEffect } from "react";
import { useSession } from "@/utils/auth-client";

interface VoteExistsResponse {
  exists: boolean;
  vote: { score: number } | null;
}

interface UsePointVoteResult {
  userHasVoted: boolean;
  userVote: number;
  isVoting: boolean;
  canVote: boolean;
  submitVote: (score: number) => Promise<boolean>;
  checkVoteStatus: () => Promise<void>;
}

export function usePointVote(pointId: string): UsePointVoteResult {
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<number>(0);
  const [isVoting, setIsVoting] = useState(false);
  const { data: session } = useSession();

  const canVote = !!session?.user && !userHasVoted;

  const checkVoteStatus = async () => {
    if (!session?.user || !pointId) return;

    try {
      const response = await fetch(`/api/vote/exists?pointId=${pointId}`);
      if (response.ok) {
        const data: VoteExistsResponse = await response.json();
        setUserHasVoted(data.exists);
        setUserVote(data.vote?.score || 0);
      }
    } catch (error) {
      console.error("Error checking user vote:", error);
    }
  };

  const submitVote = async (score: number): Promise<boolean> => {
    if (!canVote || isVoting) return false;

    setIsVoting(true);
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pointId,
          score,
        }),
      });

      if (response.ok) {
        setUserHasVoted(true);
        setUserVote(score);
        return true;
      } else {
        const errorText = await response.text();
        console.error("Error voting:", errorText);
        return false;
      }
    } catch (error) {
      console.error("Error voting:", error);
      return false;
    } finally {
      setIsVoting(false);
    }
  };

  useEffect(() => {
    const checkUserVote = async () => {
      if (!session?.user || !pointId) return;

      try {
        const response = await fetch(`/api/vote/exists?pointId=${pointId}`);
        if (response.ok) {
          const data: VoteExistsResponse = await response.json();
          setUserHasVoted(data.exists);
          setUserVote(data.vote?.score || 0);
        }
      } catch (error) {
        console.error("Error checking user vote:", error);
      }
    };

    checkUserVote();
  }, [session, pointId]);

  return {
    userHasVoted,
    userVote,
    isVoting,
    canVote,
    submitVote,
    checkVoteStatus,
  };
}

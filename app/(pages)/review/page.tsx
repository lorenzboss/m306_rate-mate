"use client";

import {
  createReview,
  getAspects,
  getUsers,
} from "@/app/actions/wizard-actions";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Globe,
  Lock,
  MessageSquare,
  Star,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

// TypeScript Interfaces
interface Aspect {
  AspectID: string;
  Name: string;
  Description: string;
}

interface User {
  UserID: string;
  EMail: string;
}

interface AspectRating {
  aspectId: string;
  rating: number;
}

interface CreateReviewData {
  receiverId: string;
  aspectRatings: AspectRating[];
  isPrivate: boolean;
  comment?: string;
}

interface RatingsState {
  [aspectId: string]: number;
}

interface ServerActionResult<T = any> {
  success: boolean;
  error?: string;
  message?: string;
  aspects?: Aspect[];
  users?: User[];
  reviewId?: string;
  data?: T;
}

const ReviewWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedReceiver, setSelectedReceiver] = useState<string>("");
  const [selectedAspects, setSelectedAspects] = useState<Set<string>>(
    new Set(),
  );
  const [ratings, setRatings] = useState<RatingsState>({});
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Data from server actions
  const [aspects, setAspects] = useState<Aspect[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    const loadInitialData = async (): Promise<void> => {
      try {
        setDataLoading(true);
        setError("");

        const [aspectsResult, usersResult]: [
          ServerActionResult,
          ServerActionResult,
        ] = await Promise.all([getAspects(), getUsers()]);

        if (!aspectsResult.success) {
          throw new Error(aspectsResult.error || "Failed to load aspects");
        }

        if (!usersResult.success) {
          throw new Error(usersResult.error || "Failed to load users");
        }

        setAspects(aspectsResult.aspects || []);
        setUsers(usersResult.users || []);
      } catch (err) {
        console.error("Error loading data:", err);
        setError((err as Error).message || "Failed to load data");
      } finally {
        setDataLoading(false);
      }
    };

    if (session) {
      loadInitialData();
    }
  }, [session]);

  const steps = [
    {
      number: 1,
      title: "Person & Aspekte auswählen",
      description: "Wählen Sie die zu bewertende Person und Aspekte aus",
    },
    {
      number: 2,
      title: "Bewertungen abgeben",
      description: "Bewerten Sie die ausgewählten Aspekte von 1-5 Sternen",
    },
    {
      number: 3,
      title: "Kommentar & Sichtbarkeit",
      description:
        "Fügen Sie einen optionalen Kommentar hinzu und bestimmen Sie die Sichtbarkeit",
    },
  ];

  const handleAspectToggle = (aspectId: string): void => {
    const newSelected = new Set(selectedAspects);
    if (newSelected.has(aspectId)) {
      newSelected.delete(aspectId);
      const newRatings: RatingsState = { ...ratings };
      delete newRatings[aspectId];
      setRatings(newRatings);
    } else {
      newSelected.add(aspectId);
    }
    setSelectedAspects(newSelected);
  };

  const handleRatingChange = (aspectId: string, rating: number): void => {
    setRatings((prev: RatingsState) => ({
      ...prev,
      [aspectId]: rating,
    }));
  };

  const canProceedToStep2: boolean =
    selectedReceiver !== "" && selectedAspects.size > 0;
  const canProceedToStep3: boolean = Array.from(selectedAspects).every(
    (aspectId: string) => ratings[aspectId] > 0,
  );

  const handleSubmit = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError("");

      const aspectRatings: AspectRating[] = Array.from(selectedAspects).map(
        (aspectId: string) => ({
          aspectId,
          rating: ratings[aspectId],
        }),
      );

      const reviewData: CreateReviewData = {
        receiverId: selectedReceiver,
        aspectRatings,
        isPrivate,
        comment: comment.trim() || undefined,
      };
      const result: ServerActionResult = await createReview(reviewData);

      if (!result.success) {
        throw new Error(result.error || "Failed to create review");
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Error creating review:", err);
      setError((err as Error).message || "Failed to create review");
    } finally {
      setIsLoading(false);
    }
  };

  const resetWizard = (): void => {
    setCurrentStep(1);
    setSelectedReceiver("");
    setSelectedAspects(new Set());
    setRatings({});
    setIsPrivate(false);
    setComment("");
    setIsSubmitted(false);
    setError("");
  };

  interface StarRatingProps {
    rating: number;
    onRatingChange: (aspectId: string, rating: number) => void;
    aspectId: string;
  }

  const StarRating: React.FC<StarRatingProps> = ({
    rating,
    onRatingChange,
    aspectId,
  }) => {
    const [hoverRating, setHoverRating] = useState<number>(0);

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star: number) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(aspectId, star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-colors duration-150"
          >
            <Star
              size={24}
              className={`${
                star <= (hoverRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              } hover:fill-yellow-400 hover:text-yellow-400`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Loading state
  if (dataLoading) {
    return (
      <div className="mx-auto my-8 max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Lade Daten...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !isSubmitted) {
    return (
      <div className="mx-auto my-8 max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div className="py-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Fehler beim Laden
          </h2>
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Seite neu laden
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className="mx-auto my-8 max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Review erfolgreich erstellt!
          </h2>
          <p className="mb-6 text-gray-600">
            Ihr Review wurde erfolgreich gespeichert und ist nun{" "}
            {isPrivate ? "privat" : "öffentlich"} sichtbar.
          </p>
          <div className="space-x-4">
            <button
              onClick={resetWizard}
              className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Neues Review erstellen
            </button>
            <button
              onClick={() => (window.location.href = "/analytics")}
              className="rounded-md bg-gray-600 px-6 py-2 text-white transition-colors hover:bg-gray-700"
            >
              Zu Reviews
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-8 max-w-2xl rounded-lg bg-white p-6 shadow-lg">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  currentStep >= step.number
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {currentStep > step.number ? <Check size={20} /> : step.number}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-4 h-1 w-full ${
                    currentStep > step.number ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-gray-600">{steps[currentStep - 1].description}</p>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Select Person and Aspects */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Person Selection */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              <User className="mr-2 inline h-4 w-4" />
              Person auswählen
            </label>
            <div className="relative">
              <select
                value={selectedReceiver}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedReceiver(e.target.value)
                }
                className="w-full appearance-none rounded-lg border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 pr-12 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="" className="text-gray-500">
                  ✨ Bitte wählen Sie eine Person aus
                </option>
                {users.map((user: User) => (
                  <option
                    key={user.UserID}
                    value={user.UserID}
                    className="text-gray-900"
                  >
                    👤 {user.EMail}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <svg
                  className="h-5 w-5 text-gray-400 transition-colors duration-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {users.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                Keine anderen Benutzer verfügbar.
              </p>
            )}
          </div>

          {/* Aspects Selection */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Aspekte auswählen ({selectedAspects.size} ausgewählt)
            </label>
            {aspects.length === 0 ? (
              <p className="text-sm text-gray-500">Keine Aspekte verfügbar.</p>
            ) : (
              <div className="space-y-3">
                {aspects.map((aspect: Aspect) => (
                  <div
                    key={aspect.AspectID}
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                      selectedAspects.has(aspect.AspectID)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleAspectToggle(aspect.AspectID)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedAspects.has(aspect.AspectID)}
                        onChange={() => handleAspectToggle(aspect.AspectID)}
                        className="mr-3 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {aspect.Name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {aspect.Description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Rate Aspects */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="mb-4 text-sm text-gray-600">
            Bewerten Sie die ausgewählten Aspekte für:{" "}
            <strong>
              {users.find((u: User) => u.UserID === selectedReceiver)?.EMail}
            </strong>
          </div>

          {Array.from(selectedAspects).map((aspectId: string) => {
            const aspect: Aspect | undefined = aspects.find(
              (a: Aspect) => a.AspectID === aspectId,
            );
            if (!aspect) return null;

            return (
              <div
                key={aspectId}
                className="rounded-lg border border-gray-200 p-4"
              >
                <h3 className="mb-2 font-medium text-gray-900">
                  {aspect.Name}
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  {aspect.Description}
                </p>
                <div className="flex items-center space-x-4">
                  <StarRating
                    rating={ratings[aspectId] || 0}
                    onRatingChange={handleRatingChange}
                    aspectId={aspectId}
                  />
                  <span className="text-sm text-gray-600">
                    {ratings[aspectId]
                      ? `${ratings[aspectId]} von 5 Sternen`
                      : "Noch nicht bewertet"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Step 3: Comment and Privacy Settings */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="mb-6 text-sm text-gray-600">
            Fügen Sie einen optionalen Kommentar hinzu und bestimmen Sie die
            Sichtbarkeit des Reviews.
          </div>

          {/* Comment Section */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              <MessageSquare className="mr-2 inline h-4 w-4" />
              Kommentar (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setComment(e.target.value)
              }
              placeholder="✍️ Fügen Sie hier zusätzliche Bemerkungen oder Feedback hinzu..."
              className="w-full resize-none rounded-lg border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              rows={4}
              maxLength={1000}
            />
            <div className="mt-1 text-right text-xs text-gray-500">
              {comment.length}/1000 Zeichen
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Sichtbarkeit
            </label>
            <div className="space-y-4">
              <div
                className={`cursor-pointer rounded-lg border p-4 transition-all ${
                  !isPrivate
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setIsPrivate(false)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    checked={!isPrivate}
                    onChange={() => setIsPrivate(false)}
                    className="mr-3 h-4 w-4 text-blue-600"
                  />
                  <Globe className="mr-3 h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Öffentlich</h3>
                    <p className="text-sm text-gray-600">
                      Der Empfänger sieht, von wem das Review stammt.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`cursor-pointer rounded-lg border p-4 transition-all ${
                  isPrivate
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setIsPrivate(true)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(true)}
                    className="mr-3 h-4 w-4 text-blue-600"
                  />
                  <Lock className="mr-3 h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Privat</h3>
                    <p className="text-sm text-gray-600">
                      Der Empfänger sieht nicht, wer das Review verfasst hat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-medium text-gray-900">Zusammenfassung</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong>Person:</strong>{" "}
                {users.find((u: User) => u.UserID === selectedReceiver)?.EMail}
              </p>
              <p>
                <strong>Bewertete Aspekte:</strong> {selectedAspects.size}
              </p>
              <p>
                <strong>Durchschnittsbewertung:</strong>{" "}
                {selectedAspects.size > 0
                  ? (
                      Array.from(selectedAspects).reduce(
                        (sum: number, aspectId: string) =>
                          sum + (ratings[aspectId] || 0),
                        0,
                      ) / selectedAspects.size
                    ).toFixed(1)
                  : "0"}{" "}
                Sterne
              </p>
              <p>
                <strong>Kommentar:</strong>{" "}
                {comment.trim() ? `"${comment.trim()}"` : "Kein Kommentar"}
              </p>
              <p>
                <strong>Sichtbarkeit:</strong>{" "}
                {isPrivate ? "Privat" : "Öffentlich"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 mb-4 flex justify-between">
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1}
          className="flex items-center rounded-md bg-gray-100 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          Zurück
        </button>

        {currentStep < 3 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={
              (currentStep === 1 && !canProceedToStep2) ||
              (currentStep === 2 && !canProceedToStep3)
            }
            className="flex items-center rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Weiter
            <ArrowRight size={16} className="ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center rounded-md bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Wird erstellt...
              </>
            ) : (
              <>
                <Check size={16} className="mr-2" />
                Review erstellen
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewWizard;

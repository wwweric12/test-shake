interface ProfileErrorStateProps {
  message: string;
  onBack: () => void;
}

export function ProfileErrorState({ message, onBack }: ProfileErrorStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <p className="body1 text-custom-deepgray">{message}</p>
      <button onClick={onBack} className="text-custom-purple subhead1 underline">
        뒤로가기
      </button>
    </div>
  );
}

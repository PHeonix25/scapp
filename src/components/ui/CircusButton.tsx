interface CircusButtonProps {
  action: () => Promise<void>;
  text: string;
  disabled?: boolean;
}

export function CircusButton({ action, text, disabled }: CircusButtonProps) {
  return (
    <button
      onClick={action}
      className='flex max-w-sm rounded-xl bg-gradient-to-tr from-pink-300 to-blue-300 p-0.5 shadow text-foreground cursor-pointer'
      disabled={disabled}
    >
      <p className='flex-1 bg-card px-6 py-2 rounded-xl'>{text}</p>
    </button>
  );
}

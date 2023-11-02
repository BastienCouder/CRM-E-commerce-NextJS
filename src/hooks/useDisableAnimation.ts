import { useAnimationContext } from "@/context/AnimationContext";
export function useDisableAnimation() {
  const { disableAnimation, setDisableAnimation } = useAnimationContext();

  const handleEnableAnimation = () => {
    setDisableAnimation(false);
  };

  const handledisableAnimation = () => {
    setDisableAnimation(true);
  };

  return { handleEnableAnimation, disableAnimation, handledisableAnimation };
}

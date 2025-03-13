import { Palette as PaletteIcon } from "lucide-react";

// This is a simple wrapper component to fix the missing Palette icon issue
export function Palette(props: React.ComponentProps<typeof PaletteIcon>) {
  return <PaletteIcon {...props} />;
}

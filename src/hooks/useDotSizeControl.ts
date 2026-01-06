import { useState } from "react";

import { DotSize, DotSizeConfig } from "@/types/timeline";
import { dotSizeConfig } from "@/store/Timeline";

export interface UseDotSizeControlReturn {
    dotSize: DotSize;
    setDotSize: (size: DotSize) => void;
    currentDotConfig: DotSizeConfig;
    dotSizeConfig: Record<DotSize, DotSizeConfig>;
}

/**
 * Custom hook for managing dot size control
 * @param initialSize - Initial dot size (default: 'medium')
 * @returns Object with dotSize, setDotSize function, currentDotConfig, and dotSizeConfig
 */
export const useDotSizeControl = (
    initialSize: DotSize = 'medium'
): UseDotSizeControlReturn => {
    const [dotSize, setDotSize] = useState<DotSize>(initialSize);

    const currentDotConfig = dotSizeConfig[dotSize];

    return {
        dotSize,
        setDotSize,
        currentDotConfig,
        dotSizeConfig
    };
};

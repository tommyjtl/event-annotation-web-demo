import { DotSize, DotSizeConfig } from "@/types/timeline";

export const dotSizeConfig: Record<DotSize, DotSizeConfig> = {
    small: {
        className: 'w-1.5 h-1.5 border',
        offset: 3 // half of 6px (1.5rem = 6px)
    },
    medium: {
        className: 'w-2.5 h-2.5 border-2',
        offset: 5 // half of 10px (3rem = 12px)
    },
    large: {
        className: 'w-3.5 h-3.5 border-2',
        offset: 7 // half of 14px (4rem = 16px)
    }
};
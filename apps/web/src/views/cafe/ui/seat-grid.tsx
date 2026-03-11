'use client';

import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui';

import type { Cafe } from '@repo/shared';

const SEATS_PER_ROW = 5;
const getRowLetter = (rowIndex: number) => String.fromCharCode(65 + rowIndex);
const getColNumber = (colIndex: number) => colIndex + 1;

function getSeatStateStyle(state: string): string {
    switch (state) {
        case 'IDLE':
            return 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500';
        case 'LOCKED':
            return 'bg-amber-400 dark:bg-amber-600';
        case 'USING':
            return 'bg-gray-100 dark:bg-gray-500 cursor-not-allowed';
        default:
            return 'bg-gray-200 dark:bg-gray-700';
    }
}

export function SeatGrid({ seats }: { seats: Cafe['seats'] }) {
    const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);

    const sorted = [...seats].sort((a, b) => a.seatNumber - b.seatNumber);
    const rows: (typeof seats)[] = [];
    for (let i = 0; i < sorted.length; i += SEATS_PER_ROW) {
        rows.push(sorted.slice(i, i + SEATS_PER_ROW));
    }

    return (
        <div className="inline-flex flex-col gap-2">
            {rows.map((rowSeats, rowIndex) => {
                const rowLetter = getRowLetter(rowIndex);
                return (
                    <div key={rowIndex} className="flex items-center gap-2">
                        <div className="text-muted-foreground flex h-10 w-6 shrink-0 items-center justify-end pr-2 text-xs font-medium">
                            {rowLetter}
                        </div>
                        <div className="flex gap-2">
                            {Array.from(
                                { length: SEATS_PER_ROW },
                                (_, colIndex) => {
                                    const seat = rowSeats[colIndex];
                                    if (!seat) {
                                        return (
                                            <div
                                                key={`empty-${rowIndex}-${colIndex}`}
                                                className="h-10 w-12 shrink-0 rounded border border-dashed border-gray-200 dark:border-gray-700"
                                            />
                                        );
                                    }
                                    const isSelected =
                                        selectedSeatId === seat.seatId;
                                    const isIdle = seat.state === 'IDLE';

                                    return (
                                        <button
                                            key={seat.seatId}
                                            type="button"
                                            disabled={!isIdle}
                                            title={`${seat.seatName} · ${seat.seatType}`}
                                            onClick={() =>
                                                isIdle
                                                    ? setSelectedSeatId(
                                                          isSelected
                                                              ? null
                                                              : seat.seatId
                                                      )
                                                    : undefined
                                            }
                                            className={cn(
                                                'flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded border text-xs font-medium transition-colors dark:border-gray-600',
                                                isIdle &&
                                                    'cursor-pointer border-gray-300',
                                                !isIdle &&
                                                    'cursor-not-allowed border-gray-200 opacity-80 dark:border-gray-700',
                                                !isSelected &&
                                                    getSeatStateStyle(
                                                        seat.state
                                                    ),
                                                isSelected &&
                                                    'border-green-600 bg-green-600 text-white dark:border-green-500 dark:bg-green-600 dark:text-white'
                                            )}
                                        >
                                            <Typography.Small
                                                className={cn(
                                                    'w-full overflow-hidden text-center text-ellipsis whitespace-nowrap',
                                                    isSelected &&
                                                        'text-white dark:text-white'
                                                )}
                                            >
                                                {seat.seatName}
                                            </Typography.Small>
                                            <Typography.XSmall
                                                className={cn(
                                                    'w-full overflow-hidden text-center text-ellipsis whitespace-nowrap',
                                                    isSelected &&
                                                        'text-green-100 dark:text-green-100',
                                                    !isSelected &&
                                                        'text-muted-foreground'
                                                )}
                                            >
                                                {seat.seatType}
                                            </Typography.XSmall>
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>
                );
            })}
            <div className="flex items-center gap-2">
                <div className="h-10 w-6 shrink-0" />
                <div className="flex gap-2">
                    {Array.from({ length: SEATS_PER_ROW }, (_, i) =>
                        getColNumber(i)
                    ).map((colNum) => (
                        <div
                            key={colNum}
                            className="text-muted-foreground flex h-10 w-12 shrink-0 items-center justify-center text-xs font-medium"
                        >
                            {colNum}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

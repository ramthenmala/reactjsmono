"use client"

import React from "react";
import { Bar, CartesianGrid, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { BarChartProps, CustomTooltipProps, TooltipPayload, WrappedXAxisTickProps } from '../../types/barChart';

// Custom wrapped axis tick component for text wrapping
function WrappedXAxisTick({ x, y, payload }: WrappedXAxisTickProps) {
    const text = String(payload.value ?? "");
    // Simple text wrapping - split on spaces and limit line length
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
        if (currentLine.length + word.length + 1 <= 12) {
            currentLine = currentLine ? currentLine + ' ' + word : word;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) lines.push(currentLine);

    return (
        <text x={x} y={y} textAnchor="middle" fill="currentColor" className="text-xs text-gray-600">
            {lines.map((line, idx) => (
                <tspan key={idx} x={x} dy={idx === 0 ? 0 : 12}>{line}</tspan>
            ))}
        </text>
    );
}

// Custom tooltip component
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
                <p className="text-sm font-medium text-gray-900">{`${label}`}</p>
                <p className="text-sm text-brand-600">
                    {`Quantity: ${payload[0].value.toLocaleString()}`}
                </p>
            </div>
        );
    }
    return null;
}

export function BarChart({data}: BarChartProps) {
    
    return (
        <div className="h-92 w-full">
            <ResponsiveContainer width="100%" height={240}>
                <RechartsBarChart
                    data={data}
                    margin={{
                        left: 4,
                        right: 0,
                        top: 12,
                        bottom: 24,
                    }}
                >
                    <CartesianGrid 
                        vertical={false} 
                        stroke="#E5E7EB" 
                        className="opacity-50"
                    />

                    <XAxis
                        axisLine={false}
                        tickLine={false}
                        tickMargin={11}
                        interval={0}
                        dataKey="label"
                        tick={<WrappedXAxisTick x={0} y={0} payload={{ value: "" }} />}
                        className="text-gray-600"
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                        tickFormatter={(value) => Number(value).toLocaleString()}
                        className="text-gray-600 text-xs"
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{
                            fill: 'rgba(209, 213, 219, 0.2)',
                        }}
                    />

                    <Bar
                        dataKey="quantity"
                        fill="rgb(105, 65, 198)" // brand-700 color
                        maxBarSize={32}
                        radius={[6, 6, 0, 0]}
                    />
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}
import { useEffect, useRef } from "react";
import { axisLeft, axisBottom } from "d3-axis";
import {
    scaleBand,
    scaleLinear,
    select,
    selectAll,
} from "d3";
import "./App.css";

/* Chart config */
const WIDTH = 150;
const HEIGHT = 150;
const MARGIN =  { top: 50, right: 0, bottom: 20, left: 50 };
const INNER_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const TICK_LINE_SPACING = 700;
const CHART_ALIGN = 250;
const Y_AXIS_DIFFERENCE = 25;

const getYAxisNumber = (y_max_value) => {
    let arr = [0];
    let i = 0;
    let splittedValue = Math.floor(y_max_value / Y_AXIS_DIFFERENCE);

    while (i <= splittedValue) {
        arr.push(arr[arr.length -1] + Y_AXIS_DIFFERENCE);
        i++;
    }
    return arr;
}

const AxisBottom = ({ scale, transform }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            select(ref.current)
            .attr("class", "x axis-grid") // <-- CSS styles applied
            .call(axisBottom(scale));
        }
    }, [scale]);

    return <g ref={ref} transform={transform} />;
}

const AxisLeft = ({ scale, y_max_value }) => {

    const ref = useRef(null);

    useEffect(() => {

        const yAxis = axisLeft(scale)
            .tickSizeInner(-INNER_WIDTH - TICK_LINE_SPACING)
            .tickSizeOuter(0)
            .tickPadding(10);
        if (ref.current) {
            select(ref.current)
            .attr("class", "y axis-grid") // <-- CSS styles applied
            .call(yAxis.tickValues(getYAxisNumber(y_max_value)));
        }
    }, [scale]);

    return <g ref={ref} />;
}

const Bars = ({ data, height, scaleX, scaleY }) => {
    return (
        <>
            {data.map(({ value, label, color }, index) => (
                <g className="bar" key={index}>
                    <rect
                        key={`bar-${label}`}
                        x={scaleX(label) + CHART_ALIGN}
                        y={scaleY(value)}
                        width={scaleX.bandwidth()}
                        height={height - scaleY(value)}
                        fill={color}
                    />
                </g>
            ))}
        </>
    );
}

export default function BarChart({ data}) {
    const Y_AXIS_MAX_VALUE = Math.max(...data.map(({ value }) => value));
    /**
    * Change Scaleband as per tool
    * https://observablehq.com/@d3/d3-scaleband
    */
    const scaleX = scaleBand()
        .domain(data.map(({ label }) => label))
        .range([0, WIDTH])
        .paddingInner(0.54)
        .paddingOuter(0.2)
        .rangeRound([0, 500])
        .align(1);

    const scaleY = scaleLinear()
        .domain([0, Y_AXIS_MAX_VALUE])
        .range([HEIGHT, 0]);


    useEffect(() => {
        const bar = selectAll(".bar")
            .data(data)
            .join("g")
            .classed("bar", true);
        
        bar.append("text")
            .text(d => d.value)
            .style("text-anchor", "middle")
            .attr("x", d => (scaleX(d.label) + CHART_ALIGN) + scaleX.bandwidth() / 2)
            .attr("y", d => scaleY(d.value) - 5);
    });

    return (
        <svg
            width={WIDTH + MARGIN.left + MARGIN.right + TICK_LINE_SPACING}
            height={HEIGHT + MARGIN.top + MARGIN.bottom}
        >
            <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
            <AxisBottom scale={scaleX} transform={`translate(${CHART_ALIGN}, ${HEIGHT})`} />
            <AxisLeft scale={scaleY} y_max_value={Y_AXIS_MAX_VALUE} />
            <Bars data={data} height={HEIGHT} scaleX={scaleX} scaleY={scaleY} />
            </g>
        </svg>
    );
}

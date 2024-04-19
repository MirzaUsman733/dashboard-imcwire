import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

function TimelineCreate({
  firstComponentShow,
  secondComponentShow,
  thirdComponentShow,
  position = "left",
}) {
  const timelineItems = [
    {
      key: 1,
      content: "Compain Data",
      isGreen: firstComponentShow,
    },
    {
      key: 2,
      content: "Press Distribution",
      isGreen: secondComponentShow,
    },
    {
      key: 3,
      content: "Personal Detail",
      isGreen: thirdComponentShow,
    },
  ];

  return (
    <Timeline position={position}>
      {timelineItems.map((item, index) => (
        <TimelineItem key={item.key}>
          <TimelineSeparator>
            <TimelineDot
              sx={{
                bgcolor: item.isGreen ? "green" : "purple",
              }}
            />
            {index >= 0 && index < 2 && (
              <TimelineConnector
                variant={
                  timelineItems[index].isGreen && item.isGreen
                    ? "dashed"
                    : "default"
                }
                color={
                  timelineItems[index].isGreen && item.isGreen
                    ? "purple"
                    : "default"
                }
              />
            )}
          </TimelineSeparator>
          <TimelineContent>{item.content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

export default TimelineCreate;

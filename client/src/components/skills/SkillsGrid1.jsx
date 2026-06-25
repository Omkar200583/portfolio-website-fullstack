// ═══════════════════════════════════════════════════════════════
//  SKILLS GRID — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React from "react";
import SkillCard from "./SkillCard";

const skills = [
  { name: "React", level: 95 },
  { name: "Node.js", level: 90 },
  { name: "MongoDB", level: 85 },
  { name: "Java", level: 88 },
  { name: "Python", level: 80 },
  { name: "Three.js", level: 75 },
];

const SkillsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {skills.map((skill) => (
        <SkillCard
          key={skill.name}
          name={skill.name}
          level={skill.level}
        />
      ))}
    </div>
  );
};

export default SkillsGrid;
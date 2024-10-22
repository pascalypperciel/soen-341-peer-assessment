import React from 'react';
import TeamCard from './TeamCard';

function TeamsList({ teams, onDelete, onEdit }) {
  return (
    <div className="team-list">
      {teams.map((team, index) => (
        <TeamCard
          key={index}
          team={team}
          teams={teams}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default TeamsList;

SELECT * FROM Student s
INNER JOIN Register r ON s.id = r.id_1
INNER JOIN Slot sl ON r.id = sl.id
AND sl.hidden <> true AND r.presence <> 'Rien';
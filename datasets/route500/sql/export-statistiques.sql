\COPY (SELECT * FROM route500.statistiques) TO 'statistiques.csv' WITH CSV HEADER;

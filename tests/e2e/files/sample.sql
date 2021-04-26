SELECT
    all_tables.owner,
    all_tables.table_name,
    all_tables.read_only,
    all_tables.temporary,
    all_tables.tablespace_name,
    all_tables.dropped,
    all_tables.nested,
    all_tables.secondary,
    all_tables.status
FROM
    all_tables
WHERE
        all_tables.read_only = 'NO'
    AND all_tables.dropped != 'YES'
    AND all_tables.status = 'VALID'
    AND all_tables.owner NOT IN (SELECT username from all_users where all_users.oracle_maintained = 'Y')
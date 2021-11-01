INSERT INTO
schedules (user_id, day, start_at, end_at)
VALUES
(0,1,'02:00 PM','04:00 PM'),
(0,2,'02:00 PM','04:00 PM'),
(0,3,'02:00 PM','04:00 PM'),
(2,5,'08:00 AM','06:00 PM');

INSERT INTO
users (firstname, lastname, email, password)
VALUES
('James', 'Bond', 'james.bond@gmail.com', 'b6b7fb4cad4bc020f76e16889a8e9065cb708d0f8c304a8a3db609b644da9536'),
('Tony', 'Stark', 'starkrulz@gmail.com', 'a836ebba36776b21dd0f5cdca497bff65c5bdfc8411cfbfe0111f27bde1c1894' ),
('Ali', 'G', 'nameisnotborat@gmail.com', '3b5fe14857124335bb8832cc602f8edcfa12db42be36b135bef5bca47e3f2b9c');

INSERT INTO
userschedules (username, day, start_time, end_time)
VALUES
('James123',1,'02:00 PM','04:00 PM'),
('Tony456',2,'02:00 PM','04:00 PM'),
('Ali789',3,'02:00 PM','04:00 PM'),
('Strange000',5,'08:00 AM','06:00 PM');
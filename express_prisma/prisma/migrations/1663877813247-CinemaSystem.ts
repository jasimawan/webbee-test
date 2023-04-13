import { Migration } from '../cli/migration';
import { PrismaClient } from "@prisma/client";

export default class implements Migration {
  async up(prisma: PrismaClient) {
    /**
     # ToDo: Create a migration that creates all tables for the following user stories

     For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
     To not introduce additional complexity, please consider only one cinema.

     Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

     ## User Stories

     **Movie exploration**
     * As a user I want to see which films can be watched and at what times
     * As a user I want to only see the shows which are not booked out

     **Show administration**
     * As a cinema owner I want to run different films at different times
     * As a cinema owner I want to run multiple films at the same time in different showrooms

     **Pricing**
     * As a cinema owner I want to get paid differently per show
     * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

     **Seating**
     * As a user I want to book a seat
     * As a user I want to book a vip seat/couple seat/super vip/whatever
     * As a user I want to see which seats are still available
     * As a user I want to know where I'm sitting on my ticket
     * As a cinema owner I dont want to configure the seating for every show
     */

     await prisma.$executeRaw`
      CREATE TABLE movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        duration INT NOT NULL,
        language VARCHAR(255) NOT NULL
      );

      CREATE TABLE showtimes (
        id SERIAL PRIMARY KEY,
        movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
        datetime TIMESTAMP NOT NULL,
        room_number INT NOT NULL,
        max_capacity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      );

      CREATE TABLE bookings (
        id SERIAL PRIMARY KEY,
        showtime_id INT NOT NULL REFERENCES showtimes(id) ON DELETE CASCADE,
        seat_number VARCHAR(255) NOT NULL,
        seat_type VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL
      );

      CREATE TABLE seat_types (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        premium_percentage INT NOT NULL
      );

      CREATE TABLE room_layouts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        seating_arrangement JSONB NOT NULL
      );

      CREATE TABLE rooms (
        id SERIAL PRIMARY KEY,
        layout_id INT NOT NULL REFERENCES room_layouts(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        number INT NOT NULL,
        max_capacity INT NOT NULL
      );

      CREATE INDEX showtimes_datetime_idx ON showtimes(datetime);
      CREATE INDEX showtimes_room_number_idx ON showtimes(room_number);
      CREATE INDEX bookings_seat_number_idx ON bookings(seat_number);
      CREATE INDEX bookings_seat_type_idx ON bookings(seat_type);
      CREATE INDEX bookings_user_name_idx ON bookings(user_name);
    `;
  }

  async down(prisma: PrismaClient) {
    // do nothing
    await prisma.$executeRaw`
      DROP TABLE IF EXISTS bookings;
      DROP TABLE IF EXISTS showtimes;
      DROP TABLE IF EXISTS movies;
      DROP TABLE IF EXISTS seat_types;
      DROP TABLE IF EXISTS rooms;
      DROP TABLE IF EXISTS room_layouts;
    `;
  }
}

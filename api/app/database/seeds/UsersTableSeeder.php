<?php

class UsersTableSeeder extends Seeder {

	public function run()
	{
		DB::table('users')->delete();
		DB::unprepared("ALTER TABLE `users` AUTO_INCREMENT = 1;");

		Users::create([
			'email' => 'rjschie@gmail.com',
			'password' => Hash::make('password')
		]);
	}
}
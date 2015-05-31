<?php

use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends \BaseController {

	/**
	 * Process authentication and return token
	 *
	 * @return Response
	 */
	public function authenticate()
	{
		$credentials = Input::only('email', 'password');

		try {
			if( ! $token = JWTAuth::attempt($credentials) ) {
				return Response::json(['error' => 'invalid_credentials'], 401);
			}
		} catch (JWTException $e) {
			return Response::json(['error' => $e->getMessage()], 500);
		}

		return Response::json(compact('token'));
	}


	/**
	 * Change Users Password
	 *
	 * @return Response
	 */
	public function changePass()
	{
		extract(Input::all());

		$user = JWTAuth::parseToken()->toUser();

		try {
			if( Hash::check($old_password, $user->password) ) {
				$user->password = Hash::make($new_password);
				$user->save();
				return $this->refreshToken();
			} else {
				return Response::json(['error' => "Incorrect Password."], 401);
			}
		} catch (Exception $e) {
			return Response::json(['error' => "Couldn't update password."], 400);
		}

	}


	/**
	 * Refresh the token
	 *
	 * @return Response
	 */
	public function refreshToken()
	{
		try {
			$old_token = JWTAuth::getToken();
			$new_token = JWTAuth::fromUser( JWTAuth::parseToken()->toUser() );
			if($new_token) {
				JWTAuth::invalidate($old_token);
			}
			return Response::json(['token' => $new_token]);
		} catch (JWTException $e) {
			return $e->getMessage();
		}
	}


}

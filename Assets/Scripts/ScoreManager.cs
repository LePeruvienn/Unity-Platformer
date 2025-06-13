using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ScoreManager : MonoBehaviour
{
	// Singleton instance
	public static ScoreManager Instance { get; private set; }

	// Private score variable
	private int _score = 0;

	/*
	 * Called Before Start
	 * @memberOf : UnityEngine
	 */
	void Awake() {

		// Check if an instance already exists and is not this one
		if(Instance != null && Instance != this)
			Destroy(gameObject); // Destroy duplicate
		// Else assign this as the instance and persist through scenes
		else {
			Instance = this;
			DontDestroyOnLoad(gameObject); // Persist this object
		}
	}

	/*
	 * Add 1 to the player's score
	 * @memberOf : GameSession
	 */
	public void addScore() {

		// Add 1 to score
		_score++;
	}

	/*
	 * Return the player's score
	 * @memberOf : GameSession
	 */
	public int getScore() {

		// Return current score
		return _score;
	}

	/*
	 * Reset score
	 * @memberOf : GameSession
	 */
	public void reset() {

		// Return current score
		_score = 0;
	}
}

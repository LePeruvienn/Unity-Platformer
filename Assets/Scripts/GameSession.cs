using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class GameSession : MonoBehaviour
{

	[Header("Audio SFX")]
	[SerializeField] private AudioClip lifePickupSFX;

	[Header("Player lives")]
	[SerializeField] int playerLives = 3;

	/*
	 * Called before Start
	 * @memberOf : UnityEngine
	 */
	void Awake() {

		// Get numbers of sessions
		int numberOfGameSessions = FindObjectsOfType<GameSession>().Length;

		// If there is already a session destroy this game object
		if(numberOfGameSessions > 1)
			Destroy(gameObject);
		// Else we dont destory it
		else
			DontDestroyOnLoad(gameObject);
	}

	/*
	 * Start is called before the first frame update
	 * @memberOf : UnityEngine
	 */
	void Start() {
		
	}

	/*
	 * Called every frame
	 * @memberOf : UnityEngine
	 */
	void Update() {
	
	}

	/*
	 * Remove a live from player
	 * @memberOf : GameSession
	 */
	private void takeLife() {

		// Play life pickup SFX
		AudioSource.PlayClipAtPoint(lifePickupSFX, Camera.main.transform.position);

		// Remove one player live
		playerLives--;
	}

	/*
	 * Used to handle player death when he is 
	 * @memberOf : GameSession
	 */
	public void processPlayerDeath(bool forceDeath = false) {

		// If player stil have lives left and we dont want to force player death
		if(playerLives > 1 && forceDeath == false)
			// Remove one life
			takeLife();

		// Else reset game session
		else
			resetGameSession();
	}

	/*
	 * Reset current game session and go back to start of the game
	 * @memberOf : GameSession
	 */
	public void resetGameSession() {

		// Load scene 0
		SceneManager.LoadScene(0);
	}
}

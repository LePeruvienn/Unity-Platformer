using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class GameSession : MonoBehaviour
{

	private GameObject[] _heartObjects;

	[Header("Audio SFX")]
	[SerializeField] private AudioClip lifePickupSFX;

	[Header("Player")]
	[SerializeField] private GameObject playerObject;
	[SerializeField] private int playerLives = 3;
	[SerializeField] private float immuneDuration = 3f;

	[Header("UI")]
	[SerializeField] private Sprite fullHeart;
	[SerializeField] private Sprite emptyHeart;
	[SerializeField] private GameObject healthBarRoot;
	[SerializeField] private GameObject heartPrefab;

	private PlayerMovement _playerMovement;

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
		
		// Get player PlayerMovement object from player
		_playerMovement = playerObject.GetComponent<PlayerMovement>();

		// Setup haert objects array
		_heartObjects = new GameObject[playerLives];

		// Intialize healthbar
		initHealthBar();
	}

	/*
	 * Called every frame
	 * @memberOf : UnityEngine
	 */
	void Update() {
	}

	private void initHealthBar() {

		// Check if all is set good
		if (heartPrefab == null) Debug.LogError("heartPrefab not set !!");
		if (healthBarRoot == null) Debug.LogError("healthBarRoot not set !!");

		// Generate hearts objects in UI
		for (int i = 0; i < playerLives; i++) {

			// Instantiate object
			GameObject heartImage = Instantiate(heartPrefab, healthBarRoot.transform.position, healthBarRoot.transform.rotation) as GameObject;

			// Set localScale & position & parent
			heartImage.transform.position = healthBarRoot.transform.position;
			heartImage.transform.localPosition = healthBarRoot.transform.position;
			heartImage.transform.parent = healthBarRoot.transform;
			heartImage.transform.localScale = new Vector3 (1, 1, 1);

			// Set image
			Image image = heartImage.GetComponent<Image>();
			image.sprite = fullHeart;

			// Save object is _heartObjects array
			_heartObjects[i] = heartImage;
		}
	}

	/*
	 * Remove a live from player
	 * @memberOf : GameSession
	 */
	public void takeLife() {

		// If player has no lives return
		if (playerLives == 0) return;

		// If player is immmune dont handle takeLife
		if (_playerMovement.isImmune()) return;

		// Play life pickup SFX
		AudioSource.PlayClipAtPoint(lifePickupSFX, Camera.main.transform.position);

		// Set empty heart image
		Image image = _heartObjects[playerLives - 1].GetComponent<Image>();
		image.sprite = emptyHeart;

		// Remove one player live
		playerLives--;

		// if player still alive
		if (playerLives > 0)
			// Set player immune for 3 seconds 👼
			_playerMovement.setImmune(immuneDuration);
		else
			_playerMovement.kill();
	}

	/*
	 * Used to handle player death when he is 
	 * @memberOf : GameSession
	 */
	private void processPlayerDeath(bool forceDeath = false) {

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
	private void resetGameSession() {

		// Load scene 0
		SceneManager.LoadScene(0);
	}
}

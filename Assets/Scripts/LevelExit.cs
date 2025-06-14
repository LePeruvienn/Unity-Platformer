using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using TMPro;

public class LevelExit : MonoBehaviour
{
	private int currentSceneIndex;

	[SerializeField] private AudioClip nextLevelSFX;
	[SerializeField] private int delayInSeconds = 1;

	[Header("In Case this is the last Level")]
	[SerializeField] private bool isTheLastLevel = false;
	[SerializeField] private GameObject winCanvas;
	[SerializeField] private TMP_Text scoreText;

	/*
	 * Start called before the first frame
	 * @memberOf : UnityEngine
	 */
	void Start() {

		// Get current active scene index
		currentSceneIndex = SceneManager.GetActiveScene().buildIndex;
	}

	/*
	 * Is called every frame
	 * @memberOf : UnityEngine
	 */
	void Update() {
		
	}

	/*
	 * Called when new object is colliding
	 * @memberOf : UnityEngine.Event
	 */
	void OnTriggerEnter2D(Collider2D other) {

		// If not triggered by a player stop here
		if (other.gameObject.layer != LayerMask.NameToLayer("Player")) return;

		if (isTheLastLevel) {

			winCanvas.SetActive(true);
			scoreText.SetText("GG ! Your score is " + ScoreManager.Instance.getScore());
			return;
		};

		// Play next level sfx
		AudioSource.PlayClipAtPoint(nextLevelSFX, Camera.main.transform.position);

		// Load scene after waiting delay
		Invoke("LoadScene", delayInSeconds);
	}

	/*
	 * Load Next Level
	 * @memberOf : LevelExit
	 */
	void LoadScene() {
		// Load Next Scene
		SceneManager.LoadScene(currentSceneIndex + 1);
	}
}

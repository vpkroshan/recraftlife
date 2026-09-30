package com.recraftlife.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RecraftLifeApp()
        }
    }
}

@Composable
fun RecraftLifeApp() {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xFFF4F8F5)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(18.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "RecraftLife",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "E-waste recycling",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color(0xFF49615B)
                    )
                }

                Card(shape = CircleShape) {
                    Image(
                        painter = painterResource(android.R.drawable.sym_def_app_icon),
                        contentDescription = "App logo",
                        modifier = Modifier
                            .size(48.dp)
                            .background(Color(0xFF2FA57C))
                    )
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text("Welcome back", color = Color(0xFF49615B))
                    Text("Your next e-waste pickup is ready.", fontWeight = FontWeight.Bold)
                    Text("Request RCL-001 • Offer: $45 • Pickup: Tue, 12:00–4:00 PM")
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text("Quick actions", fontWeight = FontWeight.Bold)
                    Button(onClick = { /* Start new submission */ }, modifier = Modifier.fillMaxWidth()) {
                        Text("Submit a device")
                    }
                    Button(onClick = { /* View requests */ }, modifier = Modifier.fillMaxWidth()) {
                        Text("Track my submissions")
                    }
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text("Current status", fontWeight = FontWeight.Bold)
                    Text("Offer sent")
                    Text("Payment status: pending")
                    Text("Pickup status: scheduled")
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun RecraftLifePreview() {
    RecraftLifeApp()
}

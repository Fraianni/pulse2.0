# Generated by Django 5.1.3 on 2024-12-07 11:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mapdesigner', '0006_remove_mapobject_clubarea_remove_map_club_area_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='mapobject',
            name='rotation',
            field=models.FloatField(default=0),
        ),
    ]

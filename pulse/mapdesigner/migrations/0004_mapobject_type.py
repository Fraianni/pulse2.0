# Generated by Django 5.1.3 on 2024-12-02 18:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mapdesigner', '0003_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='mapobject',
            name='type',
            field=models.CharField(choices=[('table', 'Table'), ('structure', 'Structure')], default='table', max_length=10),
        ),
    ]
